import { MongoClient, Db } from 'mongodb';
import { IComment } from '@/types/comment';

// Connection URI
const uri = process.env.RAEL_DATABASE_URL || '';
let client: MongoClient;
let db: Db;
let isConnected = false;

// Enhanced connection function with better error handling
export async function connectToDatabase() {
   // Skip connection attempt if no URI is provided
   if (!uri) {
      console.error('MongoDB connection error: No database URL provided in environment variables');
      isConnected = false;
      return { client: null, db: null, isConnected: false };
   }

   try {
      if (!client) {
         //console.log('Attempting to connect to MongoDB...');
         client = new MongoClient(uri, {
            // Modified SSL settings to avoid conflicting options
            serverSelectionTimeoutMS: 5000, // 5 seconds timeout
         });

         await client.connect();
         db = client.db();
         isConnected = true;
         //console.log('Connected to MongoDB successfully');
      } else if (!isConnected) {
         // Try to reconnect if connection was lost
         //console.log('Attempting to reconnect to MongoDB...');
         await client.connect();
         db = client.db();
         isConnected = true;
         //console.log('Reconnected to MongoDB successfully');
      }

      return { client, db, isConnected };
   } catch (error) {
      console.error('MongoDB connection error:', error);
      isConnected = false;
      return { client: null, db: null, isConnected: false };
   }
}

// Helper functions for comments
export async function getComments(postId: string, currentUserId?: string): Promise<IComment[] | null> {
   if (!postId) {
      return [];
   }

   try {
      const { db, isConnected } = await connectToDatabase();

      if (!isConnected || !db) {
         return null;
      }

      // Fetch all comments for this post
      const comments = await db.collection<any>('comments').find({ postId }).sort({ createdAt: -1 }).toArray();

      // Collect all comment IDs
      const commentIds: string[] = comments.map((c: any) => (c._id || c.id)?.toString()).filter(Boolean);

      // Batch query likes: count likes for all comments in one single aggregation
      let likesCounts: any[] = [];
      let userLikes: any[] = [];

      if (commentIds.length > 0) {
         likesCounts = await db
            .collection('comment_likes')
            .aggregate([{ $match: { commentId: { $in: commentIds } } }, { $group: { _id: '$commentId', count: { $sum: 1 } } }])
            .toArray();

         if (currentUserId) {
            userLikes = await db
               .collection('comment_likes')
               .find({
                  commentId: { $in: commentIds },
                  userId: currentUserId,
               })
               .toArray();
         }
      }

      const likesMap = new Map<string, number>(likesCounts.map((item: any) => [item._id.toString(), item.count]));
      const userLikedSet = new Set<string>(userLikes.map((item: any) => item.commentId.toString()));

      // Organize comments into a tree structure
      const commentMap = new Map<string, IComment>();
      const rootComments: IComment[] = [];

      // First pass: Normalize comments, attach likes and isOwner, strip userId for privacy, and initialize replies
      const normalizedComments: IComment[] = comments.map((comment: any) => {
         const stringId = (comment._id || comment.id)?.toString() || '';
         const isOwner = !!(currentUserId && comment.userId === currentUserId);
         const likesCount = likesMap.get(stringId) || 0;
         const likedByUser = userLikedSet.has(stringId);

         const normalized: IComment = {
            ...comment,
            _id: stringId,
            parentId: comment.parentId ? comment.parentId.toString() : null,
            createdAt: comment.createdAt instanceof Date ? comment.createdAt.toISOString() : comment.createdAt,
            updatedAt: comment.updatedAt instanceof Date ? comment.updatedAt.toISOString() : comment.updatedAt,
            likesCount,
            likedByUser,
            isOwner,
            replies: [],
         };

         // Security (The Privacy Wall): Strip real userId so student identity is never leaked to the client
         delete normalized.userId;

         return normalized;
      });

      normalizedComments.forEach((comment) => {
         const key = comment._id;
         if (key) commentMap.set(key, comment);
      });

      // Second pass: Nest replies under their parents
      normalizedComments.forEach((comment) => {
         const parentKey = comment.parentId;
         if (parentKey && commentMap.has(parentKey)) {
            commentMap.get(parentKey)!.replies!.push(comment);
         } else if (!comment.parentId) {
            rootComments.push(comment);
         }
      });

      // Sort replies chronologically (oldest first) so conversation threads flow naturally
      commentMap.forEach((comment) => {
         if (comment.replies && comment.replies.length > 1) {
            comment.replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
         }
      });

      return rootComments;
   } catch (error) {
      console.error('Error fetching comments:', error);
      return null;
   }
}

export async function addComment(data: any) {
   if (!data || !data.postId) {
      //console.log('Invalid comment data - missing required fields');
      return null;
   }

   try {
      const { db, isConnected } = await connectToDatabase();
      if (!isConnected || !db) {
         //console.log('Unable to add comment - database not connected');
         return null;
      }

      const result = await db.collection('comments').insertOne({
         ...data,
         createdAt: new Date(),
         updatedAt: new Date(),
      });
      return result;
   } catch (error) {
      console.error('Error adding comment:', error);
      return null;
   }
}

export async function deleteComment(id: string) {
   if (!id) {
      //console.log('No ID provided for comment deletion');
      return null;
   }

   try {
      const { db, isConnected } = await connectToDatabase();
      if (!isConnected || !db) {
         //console.log('Unable to delete comment - database not connected');
         return null;
      }

      //console.log('Attempting to delete comment with ID:', id);

      // First try to find the comment to get its post ID
      const comment = await db.collection<any>('comments').findOne({
         $or: [
            { _id: id }, // Try as MongoDB ObjectId string
            { id: id }, // Try as legacy ID
         ],
      });

      if (!comment) {
         //console.log('Comment not found with ID:', id);
         return null;
      }

      //console.log('Found comment to delete:', comment);

      // Now delete the comment
      await db.collection<any>('comments').deleteOne({
         $or: [{ _id: id }, { id: id }],
      });

      // Cascade delete: clean up all associated likes
      await db.collection<any>('comment_likes').deleteMany({
         commentId: id,
      });

      //console.log('Delete result:', result);

      return comment;
   } catch (error) {
      console.error('Error deleting comment:', error);
      return null;
   }
}

// Like a comment
export async function likeComment(commentId: string, userId: string) {
   if (!commentId || !userId) return null;
   try {
      const { db, isConnected } = await connectToDatabase();
      if (!isConnected || !db) return null;
      // Ensure only one like per user per comment
      const existing = await db.collection('comment_likes').findOne({ commentId, userId });
      if (existing) return null;
      const result = await db.collection('comment_likes').insertOne({ commentId, userId, createdAt: new Date() });
      return result;
   } catch (error: any) {
      // Code 11000: Duplicate key error (race condition caught by unique index)
      if (error?.code === 11000) {
         return null; // Already liked
      }
      console.error('Error liking comment:', error);
      return null;
   }
}

// Unlike a comment
export async function unlikeComment(commentId: string, userId: string) {
   if (!commentId || !userId) return null;
   try {
      const { db, isConnected } = await connectToDatabase();
      if (!isConnected || !db) return null;
      const result = await db.collection('comment_likes').deleteOne({ commentId, userId });
      return result;
   } catch (error) {
      console.error('Error unliking comment:', error);
      return null;
   }
}

// Get likes count and whether the user liked a comment
export async function getCommentLikes(commentId: string, userId?: string) {
   if (!commentId) return { count: 0, likedByUser: false };
   try {
      const { db, isConnected } = await connectToDatabase();
      if (!isConnected || !db) return { count: 0, likedByUser: false };
      const count = await db.collection('comment_likes').countDocuments({ commentId });
      let likedByUser = false;
      if (userId) {
         likedByUser = !!(await db.collection('comment_likes').findOne({ commentId, userId }));
      }
      return { count, likedByUser };
   } catch (error) {
      console.error('Error getting comment likes:', error);
      return { count: 0, likedByUser: false };
   }
}
