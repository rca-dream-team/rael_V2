'use server';

import { decodeToken } from '@/utils';
import { faker } from '@faker-js/faker';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

type params = {
   postId: string;
   userId?: string;
};

export const addComment = async (params: params, formData: FormData) => {
   try {
      const { postId, userId } = params;
      const parentId = formData.get('parentId')?.toString(); // Add support for replies
      
      if (!formData.get('body') || !postId || formData.get('body')?.toString().trim() === '') {
         return null;
      }

      const token = cookies().get('rael_token');
      if (!token) {
         //console.log('no token', token);
         return null;
      }
      //console.log('userId', userId);
      const user = decodeToken(token.value);
      
      // Connect to database to check existing names
      const { db, isConnected } = await connectToDatabase();
      if (!isConnected || !db) {
         return null;
      }
      
      // Generate base name
      let baseName = faker.person.firstName() + ' ' + faker.person.lastName();
      
      // Check if name exists for this post
      let nameExists = true;
      let attempts = 0;
      const MAX_ATTEMPTS = 10;
      
      while (nameExists && attempts < MAX_ATTEMPTS) {
         const existingComment = await db.collection('comments').findOne({
            postId,
            name: baseName
         });
         
         if (!existingComment) {
            nameExists = false;
         } else {
            baseName = faker.person.firstName() + ' ' + faker.person.lastName();
         }
         attempts++;
      }

      // Create the comment
      const comment = {
         _id: new ObjectId().toString(),
         body: formData.get('body')?.toString(),
         postId,
         userId: user.id,
         name: baseName,
         createdAt: new Date(),
         updatedAt: new Date(),
         parentId: parentId || null,
         replyCount: 0
      };

      await db.collection<any>('comments').insertOne(comment);

      // If this is a reply, increment the parent comment's replyCount
      if (parentId) {
         await db.collection<any>('comments').updateOne(
            { _id: parentId },
            { $inc: { replyCount: 1 } }
         );
      }

      revalidateTag(`news-${postId}`);
      return comment;
   } catch (error) {
      console.error('Error adding comment:', error);
      return null;
   }
};

export const deleteComment = async (id: string) => {
   try {
      if (!id) {
         console.error('No comment ID provided');
         return null;
      }
      
      const token = cookies().get('rael_token');
      if (!token) {
         console.error('No authentication token found');
         return null;
      }
      
      const currentUser = decodeToken(token.value);
      if (!currentUser || !currentUser.id) {
         console.error('Invalid user token');
         return null;
      }
      
      const { db, isConnected } = await connectToDatabase();
      if (!isConnected || !db) {
         console.error('Database connection failed');
         return null;
      }
      
      // Find the comment first to verify ownership and get its details
      const comment = await db.collection<any>('comments').findOne({
         $or: [
            { _id: id },
            { id: id }
         ]
      });
      
      if (!comment) {
         console.error('Comment not found');
         return null;
      }
      
      // Verify the comment belongs to the current user
      if (comment.userId !== currentUser.id && comment.userId !== currentUser._id) {
         console.error('Unauthorized: User does not own this comment');
         return null;
      }
      
      // If this is a reply, decrement the parent's replyCount
      if (comment.parentId) {
         await db.collection<any>('comments').updateOne(
            { _id: comment.parentId },
            { $inc: { replyCount: -1 } }
         );
      }
      
      // Find all IDs to delete (the comment itself + its child replies)
      const relatedComments = await db.collection<any>('comments').find({
         $or: [
            { _id: id },
            { id: id },
            { parentId: id }
         ]
      }).toArray();

      const idsToDelete = Array.from(
         new Set([
            id,
            ...relatedComments.map((c: any) => c._id?.toString() || c.id?.toString()).filter(Boolean)
         ])
      );

      // Delete the comment and all its replies
      const result = await db.collection<any>('comments').deleteMany({
         $or: [
            { _id: { $in: idsToDelete } },
            { id: { $in: idsToDelete } },
            { parentId: { $in: idsToDelete } }
         ]
      });

      // Cascade delete: clean up all associated records in comment_likes
      await db.collection<any>('comment_likes').deleteMany({
         commentId: { $in: idsToDelete }
      });

      if (result.deletedCount > 0) {
         revalidateTag(`news-${comment.postId}`);
         return comment;
      }
      
      console.error('Failed to delete comment - no comment deleted');
      return null;
   } catch (error) {
      console.error('Error deleting comment:', error);
      return null;
   }
};

