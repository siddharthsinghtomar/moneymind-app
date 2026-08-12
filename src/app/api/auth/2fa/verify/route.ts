import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as OTPAuth from "otpauth";

// POST /api/auth/2fa/verify - Verify TOTP code and enable 2FA
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { code } = body;

  if (!code || typeof code !== "string" || code.length !== 6) {
    return NextResponse.json(
      { error: "Invalid verification code" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || !user.twoFactorSecret) {
    return NextResponse.json(
      { error: "2FA setup not initiated" },
      { status: 400 }
    );
  }

  const totp = new OTPAuth.TOTP({
    issuer: "MoneyMind",
    label: user.email ?? "user",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(user.twoFactorSecret),
  });

  const delta = totp.validate({ token: code, window: 1 });

  if (delta === null) {
    return NextResponse.json(
      { error: "Invalid verification code" },
      { status: 400 }
    );
  }

  // Enable 2FA
  await prisma.user.update({
    where: { id: session.user.id },
    data: { twoFactorEnabled: true },
  });

  return NextResponse.json({
    success: true,
    message: "Two-factor authentication enabled successfully",
  });
}

// DELETE /api/auth/2fa/verify - Disable 2FA
export async function DELETE() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      twoFactorEnabled: false,
      twoFactorSecret: null,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Two-factor authentication disabled",
  });
}
