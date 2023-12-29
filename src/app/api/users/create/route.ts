// app/api/users.ts
import prisma from '@/server/prisma';
import { UserRole } from '@prisma/client';
import { NextApiRequest } from 'next';
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

    const body = await req.json()

    // Validate data
    if (!body.email || !body.password) {
        const resp = new NextResponse("Email and password are required", { status: 401 })
        return resp
    }
    
    //   Create new client user
    const user = await prisma.user.create({
        data: {
            email: body.email,
            password: body.password,
            role: UserRole.CLIENT
        }
    });
    return NextResponse.json({
        message: 'User created successfully',
        data: {
            user
        }
    });
}

export { handler as POST }; 