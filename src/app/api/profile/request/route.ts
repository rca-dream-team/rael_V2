import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/api-middlewares';
import { fetchProfileRequest } from '@/sanity/queries/requests';
import Response from '@/types/response';
import { requestProfile } from '@/utils/funcs/fetch';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
   try {
      const token = req.cookies.get('rael_token')?.value;
      if (!token) {
         return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      if (!decoded?.email) {
         return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      const existingRequest = await fetchProfileRequest(decoded.email);
      return NextResponse.json({ data: existingRequest, message: 'Profile request' });
   } catch (error: any) {
      return NextResponse.json(new Response(null, error, 'Error getting profile request'), { status: 400 });
   }
}

export async function PUT(req: NextRequest) {
   try {
      const body = await req.json();
      const { request, requester } = body;

      if (!request || !requester) {
         return NextResponse.json({ message: 'Enter all required parameters' }, { status: 400 });
      }
      if (!request.promotion) {
         return NextResponse.json({ message: 'Enter promotion' }, { status: 400 });
      }

      const user = await getRequestUser(req);
      if (!user) {
         return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      const data = await requestProfile(request, requester);
      return NextResponse.json({ data });
   } catch (error: any) {
      return NextResponse.json(new Response(null, error, 'Error requesting profile'), { status: 400 });
   }
}
