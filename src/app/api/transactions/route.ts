import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized session' }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: session.user.id ? { id: session.user.id } : { email: session.user.email! },
      include: {
        expenses: { where: { deletedAt: null } },
        incomes: { where: { deletedAt: null } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User record not found' }, { status: 404 });
    }

    // Unify and sort transactions
    const expenses = user.expenses.map(e => ({
      id: e.id,
      type: 'EXPENSE',
      title: e.title,
      amount: e.amount,
      category: e.category,
      date: e.date,
      createdAt: e.createdAt,
    }));

    const incomes = user.incomes.map(i => ({
      id: i.id,
      type: 'INCOME',
      title: i.source, // Map source to title for unified interface
      amount: i.amount,
      category: i.category,
      date: i.date,
      createdAt: i.createdAt,
    }));

    const allTransactions = [...expenses, ...incomes].sort((a, b) => {
      // Sort by date descending, then by creation time descending
      if (a.date !== b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json({ transactions: allTransactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Database fetch failure' }, { status: 500 });
  }
}

export async function POST(req: Request) {
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

    const body = await req.json();
    const { type, title, amount, category, date } = body;

    if (!type || !title || amount === undefined || !category || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
        return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    let newTransaction;

    if (type === 'EXPENSE') {
      newTransaction = await prisma.expense.create({
        data: {
          userId: user.id,
          title,
          amount: parsedAmount,
          category,
          date,
        },
      });
    } else if (type === 'INCOME') {
      newTransaction = await prisma.income.create({
        data: {
          userId: user.id,
          source: title, // Income uses 'source' instead of 'title' in DB
          amount: parsedAmount,
          category,
          date,
        },
      });
    } else {
       return NextResponse.json({ error: 'Invalid transaction type' }, { status: 400 });
    }

    return NextResponse.json({ 
        message: 'Transaction added successfully', 
        transaction: {
            id: newTransaction.id,
            type,
            title: type === 'INCOME' ? (newTransaction as any).source : (newTransaction as any).title,
            amount: newTransaction.amount,
            category: newTransaction.category,
            date: newTransaction.date,
        }
    });

  } catch (error) {
    console.error('Error adding transaction:', error);
    return NextResponse.json({ error: 'Failed to add transaction' }, { status: 500 });
  }
}
