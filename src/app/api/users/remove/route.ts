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

    const body = await req.json()

    // Validate data
    if (!body.id) {
        const resp = new NextResponse("ID is required", { status: 401 })
        return resp
    }
    // Deelte user through ID and all their appointments
    const user = await prisma.user.delete({
        where: {
            id: body.id
        }
    });

    const appointments = await prisma.appointmentDate.deleteMany({
        where: {
            user_id: body.id
        }
    });

    return NextResponse.json({
        message: 'User deleted successfully',
        data: {
            user,
            appointments
        }
    });

}

export { handler as POST }; 