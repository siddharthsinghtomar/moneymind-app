import { NextResponse } from "next/server";
import { VerifyEmailSchema } from "@/lib/validators";
import { getVerificationTokenByToken, getUserByEmail } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = VerifyEmailSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const { token } = validatedData.data;

    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
      return NextResponse.json({ error: "Token does not exist" }, { status: 400 });
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return NextResponse.json({ error: "Token has expired" }, { status: 400 });
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      return NextResponse.json({ error: "Email does not exist" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
        email: existingToken.email,
      },
    });

    await prisma.verificationToken.delete({
      where: { id: existingToken.id },
    });

    await sendWelcomeEmail(existingUser.email!, existingUser.name || "User");

    return NextResponse.json({ success: "Email verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
