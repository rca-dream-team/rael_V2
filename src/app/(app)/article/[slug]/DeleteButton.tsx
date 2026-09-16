'use client';

import { useState } from 'react';
import { deleteComment } from '@/app/actions';

interface Props {
  id: string;
}

const DeleteButton = ({ id }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      await deleteComment(id);
      // The server action will trigger a refresh of the page data
      window.location.reload();
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Failed to delete comment');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {error && <p className="text-red-500 text-xs mb-1">{error}</p>}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-gray-500 hover:text-red-500 transition-colors"
        title="Delete comment"
      >
        {isDeleting ? (
          <span className="text-sm">Deleting...</span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        )}
      </button>
    </div>
  );
};

export default DeleteButton; 