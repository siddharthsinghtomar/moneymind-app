import { NextResponse } from "next/server";
import { ResetPasswordSchema } from "@/lib/validators";
import { getPasswordResetTokenByToken, getUserByEmail, hashPassword } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { sendPasswordChangedEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = ResetPasswordSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json({ error: "Invalid data", details: validatedData.error.issues }, { status: 400 });
    }

    const { token, password } = validatedData.data;

    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return NextResponse.json({ error: "Token has expired" }, { status: 400 });
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { id: existingUser.id },
      data: { hashedPassword },
    });

    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    });

    await sendPasswordChangedEmail(existingUser.email!);

    return NextResponse.json({ success: "Password reset successful" }, { status: 200 });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
