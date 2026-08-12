import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized session' }, { status: 401 });
    }

    const { name, email, currency, currentPassword, newPassword } = await req.json();

    const user = await prisma.user.findFirst({
      where: session.user.id ? { id: session.user.id } : { email: session.user.email! },
    });

    if (!user) {
      return NextResponse.json({ error: 'User record not found' }, { status: 404 });
    }

    const updateData: Record<string, any> = {};
    if (name && typeof name === 'string') updateData.name = name.trim();
    if (email && typeof email === 'string') updateData.email = email.trim().toLowerCase();

    if (newPassword && typeof newPassword === 'string' && newPassword.length >= 6) {
      if (user.hashedPassword && currentPassword) {
        const match = await bcrypt.compare(currentPassword, user.hashedPassword);
        if (!match) {
          return NextResponse.json({ error: 'Current password does not match records.' }, { status: 400 });
        }
      }
      updateData.hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    if (currency) {
      await prisma.userSettings.upsert({
        where: { userId: user.id },
        update: { currency },
        create: { userId: user.id, currency },
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Profile update failed' }, { status: 500 });
  }
}
