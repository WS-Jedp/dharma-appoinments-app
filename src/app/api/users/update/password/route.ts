// app/api/users.ts
import prisma from '@/server/prisma';
import { UserRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs'
import { getToken } from 'next-auth/jwt';

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
    // `Validate data
    if (!body.id || !body.password) {
        const resp = new NextResponse("ID and password are required", { status: 401 })
        return resp
    }
    
    // Update user password thorugh ID
    const user = await prisma.user.update({
        where: {
            id: body.id
        },
        data: {
            password: bcrypt.hashSync(body.password, 10)
        }
    });

    return NextResponse.json({
        message: 'Password updated successfully',
        data: {
            user
        }
    });
}

export { handler as POST }; 