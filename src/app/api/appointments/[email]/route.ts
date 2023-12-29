import prisma from "@/server/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

async function handler(req: NextApiRequest, { params }: { params: { email: string } }) {
  try {

    const token = await getToken({ req, secret });

    if (!token || !token.email) {
      return NextResponse.json({
        message: "You must be signed in to create an appointment.",
      });
    }

    const { email } = params;

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({
        message: "The user doesn't exists",
      });
    }

    const appointments = await prisma.appointmentDate.findMany({
      where: {
        user: {
          id: user?.id,
        },
      },
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong", error });
  }
}

export { handler as GET };
