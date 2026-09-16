'use client';
import { addComment } from '@/app/actions';
import Comment from '@/components/shared/Comment';
import RichContent from '@/components/shared/RichContent';
import { SubmitButton } from '@/components/ui/submit-button';
import { useAuth } from '@/contexts/AuthProvider';
import { urlFor } from '@/sanity/sanity.client';
import { News } from '@/types/news';
import { IComment } from '@/types/comment';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { BiArrowBack } from 'react-icons/bi';

interface Props {
   news: News;
   comments: IComment[];
}

const COMMENTS_PER_PAGE = 20;

const IndexPage = ({ news, comments = [] }: Props) => {
   const { user } = useAuth();
   const ref = useRef<HTMLFormElement>(null);
   const [localComments, setLocalComments] = useState<IComment[]>(comments);
   const [displayedComments, setDisplayedComments] = useState<IComment[]>(
      (comments || []).slice(0, COMMENTS_PER_PAGE)
   );
   const [page, setPage] = useState(1);
   const [showDatabaseError, setShowDatabaseError] = useState(false);

   useEffect(() => {
      setLocalComments(comments || []);
      setDisplayedComments((comments || []).slice(0, page * COMMENTS_PER_PAGE));
   }, [comments, page]);

   const loadMoreComments = () => {
      const nextPage = page + 1;
      const start = (page) * COMMENTS_PER_PAGE;
      const end = start + COMMENTS_PER_PAGE;
      const newComments = localComments.slice(0, end);
      setDisplayedComments(newComments);
      setPage(nextPage);
   };

   const updateCommentInTree = (comments: any[], updatedComment: any): any[] => {
      return comments.map(comment => {
         if (comment._id === updatedComment._id) {
            return { ...comment, ...updatedComment };
         }
         if (comment.replies && comment.replies.length > 0) {
            return {
               ...comment,
               replies: updateCommentInTree(comment.replies, updatedComment)
            };
         }
         return comment;
      });
   };

   const addReplyToComment = (comments: IComment[], parentId: string, reply: IComment): IComment[] => {
      return comments.map(comment => {
         if (comment._id === parentId) {
            return {
               ...comment,
               replyCount: (comment.replyCount || 0) + 1,
               replies: [...(comment.replies || []), reply]
            };
         }
         if (comment.replies && comment.replies.length > 0) {
            return {
               ...comment,
               replies: addReplyToComment(comment.replies, parentId, reply)
            };
         }
         return comment;
      });
   };

   const removeCommentFromTree = (comments: IComment[], commentId: string): IComment[] => {
      return comments.filter(comment => {
         if (comment._id === commentId) {
            return false;
         }
         if (comment.replies && comment.replies.length > 0) {
            comment.replies = removeCommentFromTree(comment.replies, commentId);
            // Update reply count
            comment.replyCount = comment.replies.length;
         }
         return true;
      });
   };

   const handleSubmit = async (formData: FormData) => {
      if (!user) return;

      try {
         const result = await addComment(
            { postId: news._id, userId: user.id },
            formData
         );

          if (result) {
             // Add the new root comment directly to the front of the list
             const newComment: IComment = {
                ...result,
                body: result.body || '',
                likesCount: 0,
                likedByUser: false,
                isOwner: true,
                replies: []
             };
             const updatedComments = [newComment, ...localComments];
             setLocalComments(updatedComments);
             setDisplayedComments(updatedComments.slice(0, page * COMMENTS_PER_PAGE));
             ref.current?.reset();
             setShowDatabaseError(false);
          } else {
             setShowDatabaseError(true);
          }
       } catch (error) {
          console.error('Error adding comment:', error);
          setShowDatabaseError(true);
       }
   };

   const handleReply = async (parentId: string, body: string) => {
      if (!user) return;

      const formData = new FormData();
      formData.append('body', body);
      formData.append('parentId', parentId);

      try {
         const result = await addComment(
            { postId: news._id, userId: user.id },
            formData
         );

         if (result) {
            // Update the comments state with the new reply
            const newReply: IComment = {
               ...result,
               body: result.body || '',
               likesCount: 0,
               likedByUser: false,
               isOwner: true,
               replies: []
            };
            const updatedComments = addReplyToComment(localComments, parentId, newReply);
            setLocalComments(updatedComments);
            setDisplayedComments(updatedComments.slice(0, page * COMMENTS_PER_PAGE));
            return true;
         }
         return false;
      } catch (error) {
         console.error('Error adding reply:', error);
         return false;
      }
   };

   const handleDelete = (commentId: string) => {
      const updatedComments = removeCommentFromTree(localComments, commentId);
      setLocalComments(updatedComments);
      setDisplayedComments(updatedComments.slice(0, page * COMMENTS_PER_PAGE));
   };

   const getBgImageUrl = () => {
      try {
         if (!news.image) return '';
         return urlFor(news.image).url();
      } catch (error) {
         // console.error('Error getting background image:', error);
         return '';
      }
   };

   const backgroundImageUrl = getBgImageUrl();

   return (
      <div
         className="w-full flex top-0 flex-col items-center min-hfull flex-1 bg-opacity-10 relative"
         style={{ 
            background: backgroundImageUrl ? `url(${backgroundImageUrl})` : '#f0f0f0', 
            backgroundSize: 'cover' 
         }}
      >
         <div className="absolute top-0 left-0 w-full h-full dark:bg-black/90 bg-white/95 z-0"></div>
         <div className="w-full p-6 flex flex-col max-w-4xl z-10">
            <Link href="/" className="font-semibold mb-6 flex items-center gap-2 text-lg">
               <BiArrowBack />
               All news
            </Link>
            <div className="flex w-full flex-col font-poppins">
               {news.content ? (
                  <RichContent content={news.content} />
               ) : (
                  <div className="my-4 p-4 border border-red-300 bg-red-50 rounded">
                     <h2 className="text-xl font-semibold text-red-800">Unable to load content</h2>
                     <p className="text-red-700">The article content could not be loaded. Please try again later.</p>
                  </div>
               )}
               <div className="flex gap-3 gap-y-0 md:items-end md:flex-row flex-col">
                  <h1 className="text-xl font-semibold mt-6">Comments ({localComments.length})</h1>
                  <span className="text-sm italic dark:text-gray-200">
                     Comments are anonymous, so feel free to share your thoughts
                  </span>
               </div>
               {news.commentQuestion && <span className="mt-2">{news.commentQuestion}</span>}
               {user ? (
                  <form action={handleSubmit} ref={ref}>
                  <textarea
                     name="body"
                     id="body"
                     className="w-full h-20 p-2 border bg-transparent border-gray-300 rounded-lg"
                     placeholder={news.commentQuestion ?? 'What&apos;s your take on this news 🤔? Leave a comment'}
                  ></textarea>
                  {showDatabaseError && (
                     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <p>Unable to connect to the database. Please try again later.</p>
                     </div>
                  )}
                  <SubmitButton className="mr-auto">Add Comment</SubmitButton>
               </form>
               ) : (
                  <p className="text-gray-600">Please log in to comment.</p>
               )}
               <div className="flex flex-col gap-y-6 mt-6 w-full">
                  {displayedComments.map((comment) => (
                     <Comment
                        key={comment._id || comment.id}
                        comment={comment}
                        onReply={handleReply}
                        onDelete={handleDelete}
                        replies={comment.replies || []}
                     />
                  ))}
               </div>
               {displayedComments.length < localComments.length && (
                  <div className="flex justify-center w-full mt-8">
                     <button
                        onClick={loadMoreComments}
                        className="group relative px-8 py-2.5 font-medium text-sm bg-[#1a1a1a] dark:bg-gray-800 text-white rounded-lg hover:bg-black dark:hover:bg-gray-700 transition-all duration-200 ease-in-out flex items-center gap-2 border border-gray-700/30"
                     >
                        Load More Comments
                        <span className="text-gray-400 ml-1">
                           ({localComments.length - displayedComments.length} remaining)
                        </span>
                     </button>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default IndexPage;
