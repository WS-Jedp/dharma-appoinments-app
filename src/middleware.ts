// app/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token && req.nextUrl.pathname.startsWith('/admin')) {
    const url = req.nextUrl.clone();
    url.pathname = '/'; // Update with your actual login path
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
