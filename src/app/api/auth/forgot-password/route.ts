import { NextResponse } from "next/server";
import { ForgotPasswordSchema } from "@/lib/validators";
import { getUserByEmail, generatePasswordResetToken } from "@/lib/auth-utils";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = ForgotPasswordSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const { email } = validatedData.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email) {
      return NextResponse.json({ success: "If an account exists, a reset email was sent" }, { status: 200 });
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

    return NextResponse.json({ success: "If an account exists, a reset email was sent" }, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
