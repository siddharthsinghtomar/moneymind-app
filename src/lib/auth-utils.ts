import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import crypto from "crypto";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch {
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    return await prisma.user.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

export async function getVerificationTokenByEmail(email: string) {
  try {
    return await prisma.verificationToken.findFirst({
      where: { email }
    });
  } catch {
    return null;
  }
}

export async function getVerificationTokenByToken(token: string) {
  try {
    return await prisma.verificationToken.findUnique({
      where: { token }
    });
  } catch {
    return null;
  }
}

export async function generateVerificationToken(email: string) {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires,
    }
  });

  return verificationToken;
}

export async function getPasswordResetTokenByEmail(email: string) {
  try {
    return await prisma.passwordResetToken.findFirst({
      where: { email }
    });
  } catch {
    return null;
  }
}

export async function getPasswordResetTokenByToken(token: string) {
  try {
    return await prisma.passwordResetToken.findUnique({
      where: { token }
    });
  } catch {
    return null;
  }
}

export async function generatePasswordResetToken(email: string) {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    }
  });

  return passwordResetToken;
}
