// app/api/users.ts
import prisma from '@/server/prisma';
import { UserRole } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const secret = process.env.NEXTAUTH_SECRET;

async function handler(req: NextRequest) {
  const token = await getToken({ req, secret });

  if (!token || !token.email || !token.role || token.role !== UserRole.ADMIN) {
    const response = new NextResponse(
      "You must be signed in to create an appointment.",
      { status: 401 }
    );
    return response;
  }

  const users = await prisma.user.findMany({
    where: {
        role: UserRole.CLIENT
    }
  });
  return NextResponse.json({ data: { users }, message: 'Users fetched successfully'});
}

export { handler as GET }; 