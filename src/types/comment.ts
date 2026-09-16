export interface IComment {
   _id: string;
   id?: string;
   name: string;
   body: string;
   postId: string;
   userId?: string;
   createdAt: Date | string;
   updatedAt?: Date | string;
   parentId?: string | null;
   replyCount?: number;
   likes?: number;
   likesCount?: number;
   likedByUser?: boolean;
   isOwner?: boolean;
   replies?: IComment[];
}

export interface ICommentLike {
   _id?: string;
   id?: string;
   commentId: string;
   userId: string;
   createdAt: Date | string;
}
