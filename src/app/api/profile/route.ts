import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/api-middlewares';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
   try {
      const { searchParams } = new URL(req.url);
      const user_type = searchParams.get('user_type') || req.cookies.get('user_type')?.value || undefined;

      const user = await getRequestUser(req, user_type);
      if (!user) {
         return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      return NextResponse.json({ data: user, message: 'Profile request' });
   } catch (error) {
      console.error('Error in GET /api/profile:', error);
      return NextResponse.json({ message: 'Error getting profile request' }, { status: 400 });
   }
}
