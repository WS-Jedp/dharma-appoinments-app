import prisma from "@/server/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

async function handler(req: NextRequest) {
  try {
    const token = await getToken({ req, secret });

    if (!token || !token.email) {
      const response = new NextResponse(
        "You must be signed in to create an appointment.",
        { status: 401 }
      );
      return response;
    }

    const user = await prisma.user.findUnique({
      where: { email: token.email },
    });

    if (!user) {
        const response = new NextResponse(
            "The user doesn't exists.",
            { status: 401 }
          );
          return response;
    }

    const { date, time } = await req.json() as { date: string, time: string }

    const appointment = await prisma.appointmentDate.create({
      data: {
        date,
        time,
        user: {
          connect: { id: user?.id },
        },
      },
    });

    return NextResponse.json({ appointment });
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong", error });
  }
}

export { handler as POST };
