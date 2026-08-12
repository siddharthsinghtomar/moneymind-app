import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";

// POST /api/auth/2fa/setup - Generate TOTP secret and QR code
export async function POST() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  // Generate a new TOTP secret
  const totp = new OTPAuth.TOTP({
    issuer: "MoneyMind",
    label: user.email ?? "user",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: new OTPAuth.Secret({ size: 20 }),
  });

  const secret = totp.secret.base32;
  const otpauthUrl = totp.toString();

  // Store the secret temporarily (not yet enabled)
  await prisma.user.update({
    where: { id: session.user.id },
    data: { twoFactorSecret: secret },
  });

  // Generate QR code as data URL
  const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

  return NextResponse.json({
    secret,
    qrCode: qrCodeDataUrl,
    otpauthUrl,
  });
}
