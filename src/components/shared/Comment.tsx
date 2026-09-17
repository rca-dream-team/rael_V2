'use client';
import { IComment } from '@/types';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ActionButton } from '../ui/action-icon';
import { BiTrash } from 'react-icons/bi';
import { deleteComment } from '@/app/actions';
import { useAuth } from '@/contexts/AuthProvider';
import { Modal, Text, Group, Button, Textarea } from '@mantine/core';
import axios from 'axios';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

interface CommentProps {
   comment: IComment | any;
   onReply?: (parentId: string, body: string) => Promise<boolean | void>;
   onDelete?: (commentId: string) => void;
   replies?: any[];
   depth?: number;
   isReply?: boolean;
}

const MAX_DEPTH = 3; // Maximum nesting level for replies

const Comment = ({
   comment: initialComment,
   onReply,
   onDelete,
   replies: initialReplies = [],
   depth = 0,
   isReply = false,
}: CommentProps) => {
   const { user } = useAuth();
   const [comment] = useState(initialComment);
   const [replies, setReplies] = useState(initialReplies);
   const [isDeleting, setIsDeleting] = useState(false);
   const [confirmOpen, setConfirmOpen] = useState(false);
   const [error, setError] = useState('');
   const [showReplyForm, setShowReplyForm] = useState(false);
   const [replyText, setReplyText] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [showReplies, setShowReplies] = useState(false);
   const [isDeleted, setIsDeleted] = useState(false);
   const [likesCount, setLikesCount] = useState(comment.likesCount ?? 0);
   const [liked, setLiked] = useState(comment.likedByUser ?? false);
   const [likeLoading, setLikeLoading] = useState(false);

   const commentId = comment._id || comment.id;

   useEffect(() => {
      if (comment.likesCount !== undefined) setLikesCount(comment.likesCount);
      if (comment.likedByUser !== undefined) setLiked(comment.likedByUser);
   }, [comment.likesCount, comment.likedByUser]);

   useEffect(() => {
      setReplies(initialReplies);
   }, [initialReplies]);

   const toggleLike = async () => {
      if (!user || likeLoading) return;
      setLikeLoading(true);
      const prevLiked = liked;
      const prevCount = likesCount;
      setLiked(!prevLiked);
      setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);
      try {
         if (!prevLiked) {
            await axios.post(`/api/comments/${commentId}/like`);
         } else {
            await axios.delete(`/api/comments/${commentId}/like`);
         }
      } catch {
         // Rollback UI
         setLiked(prevLiked);
         setLikesCount(prevCount);
      }
      setLikeLoading(false);
   };

   // If the comment is deleted, don't render anything
   if (isDeleted) {
      return null;
   }

   const userId = comment.userId;
   const currentUserId = user?._id || (user as any)?.id;
   const isOwner = comment.isOwner !== undefined ? comment.isOwner : currentUserId && userId && currentUserId === userId;
   const canReply = depth < MAX_DEPTH;

   const handleReplySubmit = async () => {
      if (!replyText.trim() || !onReply) return;

      setIsSubmitting(true);
      try {
         const success = await onReply(commentId, replyText);
         if (success) {
            setReplyText('');
            setShowReplyForm(false);
            setShowReplies(true);
            setError('');
         } else {
            setError('Failed to post reply. Please try again.');
         }
      } catch (error) {
         setError('Failed to post reply. Please try again.');
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleDelete = async () => {
      if (!commentId) {
         setError('No comment ID available for deletion');
         return;
      }

      setIsDeleting(true);
      setError('');

      try {
         const result = await deleteComment(commentId);
         if (result) {
            setIsDeleted(true);
            handleCloseConfirm();
            if (onDelete) {
               onDelete(commentId);
            }
         } else {
            setError('Failed to delete comment. Please try again.');
         }
      } catch (error) {
         setError('Failed to delete comment. Please try again.');
      } finally {
         setIsDeleting(false);
      }
   };

   const handleOpenConfirm = () => setConfirmOpen(true);
   const handleCloseConfirm = () => setConfirmOpen(false);

   const toggleReplies = () => {
      setShowReplies(!showReplies);
   };

   const formatDate = (date: string | Date) => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'short',
         day: 'numeric',
         hour: '2-digit',
         minute: '2-digit',
      });
   };

   return (
      <>
         <div className={`flex flex-col gap-2 w-full ${isReply ? 'ml-8' : ''}`}>
            <div className="flex items-start gap-2 w-full group">
               <Image
                  src={`https://ui-avatars.com/api/?name=${comment?.name ?? 'Anonymous'}`}
                  width={32}
                  height={32}
                  alt={comment?.name ?? 'Anonymous'}
                  className="rounded-full border"
               />
               <div className="flex flex-col relative w-full">
                  <div className="flex flex-col gap-1">
                     <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{comment.name ?? 'Anonymous'}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(comment.createdAt)}</span>
                     </div>
                     <p className="text-sm">{comment.body}</p>

                     <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        {/* Like button */}
                        <button
                           onClick={toggleLike}
                           disabled={!user || likeLoading}
                           className={`transition-all flex items-center gap-1 ${liked ? 'text-red-500' : 'text-gray-400'} focus:outline-none`}
                           aria-label={liked ? 'Unlike' : 'Like'}
                           style={{ transform: liked ? 'scale(1.2)' : 'scale(1)', transition: 'transform 0.15s' }}
                        >
                           {liked ? <AiFillHeart size={18} /> : <AiOutlineHeart size={18} />}
                           <span className="ml-1 text-xs">{likesCount}</span>
                        </button>
                        {/* Reply button - only show if not at max depth */}
                        {canReply && (
                           <button
                              onClick={() => setShowReplyForm(!showReplyForm)}
                              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1"
                           >
                              Reply
                           </button>
                        )}
                        {/* Delete button - only show for comment owner */}
                        {isOwner && (
                           <ActionButton
                              onClick={handleOpenConfirm}
                              color="red"
                              variant="transparent"
                              className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 right-0"
                           >
                              <BiTrash
                                 size={16}
                                 className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                              />
                           </ActionButton>
                        )}
                     </div>
                  </div>
               </div>
            </div>

            {/* View replies button */}
            {replies.length > 0 && (
               <button
                  onClick={toggleReplies}
                  className="ml-11 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
               >
                  <div className="w-8 h-[1px] bg-gray-300 dark:bg-gray-600"></div>
                  {showReplies ? 'Hide' : 'View'} {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
               </button>
            )}

            {/* Reply form */}
            {showReplyForm && (
               <div className="ml-11 mt-2">
                  <Textarea
                     placeholder="Write a reply..."
                     value={replyText}
                     onChange={(e) => setReplyText(e.target.value)}
                     minRows={2}
                     className="mb-2"
                     size="xs"
                  />
                  <div className="flex gap-2">
                     <Button
                        onClick={handleReplySubmit}
                        loading={isSubmitting}
                        disabled={!replyText.trim()}
                        size="xs"
                        className="bg-gray-900 hover:bg-black dark:bg-gray-100 dark:hover:bg-white dark:text-gray-900 text-white border border-gray-700/30"
                     >
                        Reply
                     </Button>
                     <Button
                        variant="outline"
                        onClick={() => setShowReplyForm(false)}
                        size="xs"
                        className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                     >
                        Cancel
                     </Button>
                  </div>
               </div>
            )}

            {/* Render replies */}
            {showReplies && replies.length > 0 && (
               <div className="flex flex-col gap-4 mt-2">
                  {replies.map((reply) => (
                     <Comment
                        key={reply._id || reply.id}
                        comment={reply}
                        onReply={onReply}
                        onDelete={onDelete}
                        replies={reply.replies || []}
                        depth={depth + 1}
                        isReply={true}
                     />
                  ))}
               </div>
            )}
         </div>

         {/* Delete confirmation modal */}
         <Modal opened={confirmOpen} onClose={handleCloseConfirm} title="Delete Comment" centered size="sm">
            <Text size="sm" mb={15}>
               Are you sure you want to delete this comment? This action cannot be undone.
            </Text>

            {error && (
               <Text color="red" size="sm" mb={15}>
                  {error}
               </Text>
            )}

            <Group position="right" mt="md">
               <Button variant="outline" onClick={handleCloseConfirm} disabled={isDeleting}>
                  Cancel
               </Button>
               <Button className="bg-red-600" onClick={handleDelete} loading={isDeleting}>
                  {isDeleting ? 'Deleting...' : 'Delete'}
               </Button>
            </Group>
         </Modal>
      </>
   );
};

export default Comment;
