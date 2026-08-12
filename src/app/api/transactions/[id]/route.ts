import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized session' }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: session.user.id ? { id: session.user.id } : { email: session.user.email! },
    });

    if (!user) {
       return NextResponse.json({ error: 'User record not found' }, { status: 404 });
    }

    const { id } = await params;
    const url = new URL(req.url);
    const type = url.searchParams.get('type'); // expecting 'INCOME' or 'EXPENSE'

    if (!type || (type !== 'INCOME' && type !== 'EXPENSE')) {
       return NextResponse.json({ error: 'Valid transaction type (INCOME or EXPENSE) is required in query params' }, { status: 400 });
    }

    if (type === 'EXPENSE') {
        const expense = await prisma.expense.findFirst({ where: { id, userId: user.id } });
        if (!expense) {
            return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
        }
        await prisma.expense.delete({ where: { id } });
    } else if (type === 'INCOME') {
        const income = await prisma.income.findFirst({ where: { id, userId: user.id } });
        if (!income) {
            return NextResponse.json({ error: 'Income not found' }, { status: 404 });
        }
        await prisma.income.delete({ where: { id } });
    }

    return NextResponse.json({ message: 'Transaction deleted successfully' });

  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}
