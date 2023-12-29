import prisma from '@/server/prisma';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const secret = process.env.NEXTAUTH_SECRET;

async function handler(req: NextRequest) {

    try {
        const token = await getToken({ req, secret });

        if (!token || !token.email) {
            const res = new NextResponse(
                "You must be logged in.",
                { status: 401 }
              );
              return res;
        }

        const user = await prisma.user.findUnique({
            where: { email: token.email },
        });

        if(!user) {
            const res = new NextResponse(
                "The user doesn't exists",
                { status: 401 }
              );
              return res;
        }

        const body = await req.json()
        const appointmentID = body.id;

        if(!appointmentID) {
            const res = new NextResponse(
                "The appointment doesn't exists",
                { status: 401 }
              );
              return res;
        }

        const appointment = await prisma.appointmentDate.delete({
            where: { id: appointmentID },
        });

    
        return NextResponse.json({ appointment }, { status: 201 });

       
    } catch (error: any) {
        const res = new NextResponse(
            error.message || "Something went wrong",
            { status: 401 }
          );
          return res;
    }

}

export { handler as POST }; 