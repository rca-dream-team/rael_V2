import { likeComment, unlikeComment, getCommentLikes } from '@/lib/mongodb';
import { decodeToken } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { commentId: string } }) {
   const token = req.cookies.get('rael_token')?.value;
   if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
   const user = decodeToken(token);
   if (!user?.id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
   const { commentId } = params;
   const result = await likeComment(commentId, user.id);
   if (!result) return NextResponse.json({ message: 'Already liked' }, { status: 400 });
   return NextResponse.json({ message: 'Liked' });
}

export async function DELETE(req: NextRequest, { params }: { params: { commentId: string } }) {
   const token = req.cookies.get('rael_token')?.value;
   if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
   const user = decodeToken(token);
   if (!user?.id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
   const { commentId } = params;
   await unlikeComment(commentId, user.id);
   return NextResponse.json({ message: 'Unliked' });
}

export async function GET(req: NextRequest, { params }: { params: { commentId: string } }) {
   const token = req.cookies.get('rael_token')?.value;
   const user = token ? decodeToken(token) : null;
   const { commentId } = params;
   const likes = await getCommentLikes(commentId, user?.id);
   return NextResponse.json(likes);
}
