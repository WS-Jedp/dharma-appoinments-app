import prisma from "@/server/prisma";
import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

async function handler(req: NextRequest) {
  if (req.method !== "POST") {
    const res = new NextResponse("Method not allowed", { status: 405 });
    return res;
  }

  const body = await req.json();

  if (!body.emailFrom) {
    return new NextResponse("Email from is required", { status: 400 });
  }

  // Nodemailer setup
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    // Fetch ADMIN users from the database
    const admins = await prisma.user.findMany({
      where: {
        role: UserRole.ADMIN,
      },
    });

    // Send email to each admin
    await Promise.all(
      admins.map((admin) => {
        transporter.sendMail({
          from: `"Dharma Appointments" <${body.emailFrom}>`,
          to: admin.email, // Admin's email
          subject: "Appointments Notification",
          text: `The user ${body.emailFrom} has finished a list of appointments. Take a look at the appointments list at ${process.env.NEXTAUTH_URL}/appointments?email=${body.emailFrom}`,
          // html: '<p>Your email content here.</p>', // If you want to send HTML formatted email
        });
      })
    );

    return NextResponse.json({
      message: "Emails sent successfully",
      data: true
    });
  } catch (error: any) {
    const res = new NextResponse(error, { status: 500 });
    return res;
  }
}

export { handler as POST };
