import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized session' }, { status: 401 });
    }

    // Resolve authenticated user record by session ID or email
    const user = await prisma.user.findFirst({
      where: session.user.id ? { id: session.user.id } : { email: session.user.email! },
      include: {
        financialAccounts: { where: { deletedAt: null } },
        expenses: { where: { deletedAt: null } },
        incomes: { where: { deletedAt: null } },
        budgets: { where: { deletedAt: null } },
        goals: { where: { deletedAt: null } },
        investments: { where: { deletedAt: null } },
        settings: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User record not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accounts: user.financialAccounts.map(a => ({
        id: a.id,
        name: a.name,
        type: a.type,
        institution: a.institution,
        accountNumberOrVpa: a.accountNumberOrVpa,
        balance: a.balance,
        color: a.color || '#00FF9D',
        lastSynced: a.lastSynced || 'Just now',
      })),
      expenses: user.expenses.map(e => ({
        id: e.id,
        title: e.title,
        amount: e.amount,
        category: e.category,
        date: e.date,
      })),
      income: user.incomes.map(i => ({
        id: i.id,
        source: i.source,
        amount: i.amount,
        category: i.category,
        date: i.date,
      })),
      budgets: user.budgets.map(b => ({
        id: b.id,
        category: b.category,
        allocated: b.allocated,
      })),
      goals: user.goals.map(g => ({
        id: g.id,
        title: g.title,
        targetAmount: g.targetAmount,
        currentAmount: g.currentAmount,
        deadline: g.deadline,
        category: g.category,
      })),
      investments: user.investments.map(inv => ({
        id: inv.id,
        name: inv.name,
        type: inv.type,
        units: inv.units,
        buyPrice: inv.buyPrice,
        currentPrice: inv.currentPrice,
      })),
      settings: user.settings || { currency: 'INR', theme: 'dark' },
    });
  } catch (error) {
    console.error('Error fetching user financial data:', error);
    return NextResponse.json({ error: 'Database fetch failure' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized session' }, { status: 401 });
    }

    const body = await req.json();
    let user = await prisma.user.findFirst({
      where: session.user.id ? { id: session.user.id } : { email: session.user.email! },
    });

    if (!user && session.user.email) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || session.user.email.split('@')[0],
        },
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'User record resolution failed' }, { status: 404 });
    }

    const userId = user.id;

    // NON-DESTRUCTIVE UPSERT ACCOUNTS (PRESERVE ALL DATA)
    if (body.accounts && Array.isArray(body.accounts)) {
      for (const a of body.accounts) {
        if (a.id && typeof a.id === 'string' && a.id.length > 5) {
          const existing = await prisma.financialAccount.findFirst({ where: { id: a.id, userId } });
          if (existing) {
            await prisma.financialAccount.update({
              where: { id: a.id },
              data: {
                name: a.name || existing.name,
                type: a.type || existing.type,
                institution: a.institution || existing.institution,
                accountNumberOrVpa: a.accountNumberOrVpa || existing.accountNumberOrVpa,
                balance: a.balance ?? existing.balance,
                color: a.color || existing.color,
                lastSynced: a.lastSynced || 'Just now',
                deletedAt: null,
              },
            });
            continue;
          }
        }
        await prisma.financialAccount.create({
          data: {
            id: a.id && a.id.length > 5 ? a.id : undefined,
            userId,
            name: a.name || 'Bank Account',
            type: a.type || 'bank',
            institution: a.institution || 'Bank',
            accountNumberOrVpa: a.accountNumberOrVpa || '•••• 0000',
            balance: a.balance || 0,
            color: a.color || '#00FF9D',
            lastSynced: a.lastSynced || 'Just now',
          },
        });
      }
    }

    // NON-DESTRUCTIVE UPSERT EXPENSES (PRESERVE ALL DATA)
    if (body.expenses && Array.isArray(body.expenses)) {
      for (const e of body.expenses) {
        if (e.id && typeof e.id === 'string' && e.id.length > 5) {
          const existing = await prisma.expense.findFirst({ where: { id: e.id, userId } });
          if (existing) {
            await prisma.expense.update({
              where: { id: e.id },
              data: {
                title: e.title || existing.title,
                amount: e.amount ?? existing.amount,
                category: e.category || existing.category,
                date: e.date || existing.date,
                deletedAt: null,
              },
            });
            continue;
          }
        }
        await prisma.expense.create({
          data: {
            id: e.id && e.id.length > 5 ? e.id : undefined,
            userId,
            title: e.title || 'Expense',
            amount: e.amount || 0,
            category: e.category || 'General',
            date: e.date || new Date().toISOString().split('T')[0],
          },
        });
      }
    }

    // NON-DESTRUCTIVE UPSERT INCOMES (PRESERVE ALL DATA)
    if (body.income && Array.isArray(body.income)) {
      for (const i of body.income) {
        if (i.id && typeof i.id === 'string' && i.id.length > 5) {
          const existing = await prisma.income.findFirst({ where: { id: i.id, userId } });
          if (existing) {
            await prisma.income.update({
              where: { id: i.id },
              data: {
                source: i.source || existing.source,
                amount: i.amount ?? existing.amount,
                category: i.category || existing.category,
                date: i.date || existing.date,
                deletedAt: null,
              },
            });
            continue;
          }
        }
        await prisma.income.create({
          data: {
            id: i.id && i.id.length > 5 ? i.id : undefined,
            userId,
            source: i.source || 'Income',
            amount: i.amount || 0,
            category: i.category || 'General',
            date: i.date || new Date().toISOString().split('T')[0],
          },
        });
      }
    }

    // NON-DESTRUCTIVE UPSERT BUDGETS (PRESERVE ALL DATA)
    if (body.budgets && Array.isArray(body.budgets)) {
      for (const b of body.budgets) {
        if (b.id && typeof b.id === 'string' && b.id.length > 5) {
          const existing = await prisma.budget.findFirst({ where: { id: b.id, userId } });
          if (existing) {
            await prisma.budget.update({
              where: { id: b.id },
              data: {
                category: b.category || existing.category,
                allocated: b.allocated ?? existing.allocated,
                deletedAt: null,
              },
            });
            continue;
          }
        }
        await prisma.budget.create({
          data: {
            id: b.id && b.id.length > 5 ? b.id : undefined,
            userId,
            category: b.category,
            allocated: b.allocated || 0,
          },
        });
      }
    }

    // NON-DESTRUCTIVE UPSERT GOALS (PRESERVE ALL DATA)
    if (body.goals && Array.isArray(body.goals)) {
      for (const g of body.goals) {
        if (g.id && typeof g.id === 'string' && g.id.length > 5) {
          const existing = await prisma.goal.findFirst({ where: { id: g.id, userId } });
          if (existing) {
            await prisma.goal.update({
              where: { id: g.id },
              data: {
                title: g.title || existing.title,
                targetAmount: g.targetAmount ?? existing.targetAmount,
                currentAmount: g.currentAmount ?? existing.currentAmount,
                deadline: g.deadline || existing.deadline,
                category: g.category || existing.category,
                deletedAt: null,
              },
            });
            continue;
          }
        }
        await prisma.goal.create({
          data: {
            id: g.id && g.id.length > 5 ? g.id : undefined,
            userId,
            title: g.title || 'Goal',
            targetAmount: g.targetAmount || 0,
            currentAmount: g.currentAmount || 0,
            deadline: g.deadline || new Date().toISOString().split('T')[0],
            category: g.category || 'General',
          },
        });
      }
    }

    // NON-DESTRUCTIVE UPSERT INVESTMENTS
    if (body.investments && Array.isArray(body.investments)) {
      for (const inv of body.investments) {
        if (inv.id && typeof inv.id === 'string' && inv.id.length > 5) {
          const existing = await prisma.investment.findFirst({ where: { id: inv.id, userId } });
          if (existing) {
            await prisma.investment.update({
              where: { id: inv.id },
              data: {
                name: inv.name || existing.name,
                type: inv.type || existing.type,
                units: inv.units ?? existing.units,
                buyPrice: inv.buyPrice ?? existing.buyPrice,
                currentPrice: inv.currentPrice ?? existing.currentPrice,
                deletedAt: null,
              },
            });
            continue;
          }
        }
        await prisma.investment.create({
          data: {
            id: inv.id && inv.id.length > 5 ? inv.id : undefined,
            userId,
            name: inv.name || 'Investment',
            type: inv.type || 'Stock',
            units: inv.units || 0,
            buyPrice: inv.buyPrice || 0,
            currentPrice: inv.currentPrice || 0,
          },
        });
      }
    }

    // SYNC USER SETTINGS
    if (body.currency) {
      await prisma.userSettings.upsert({
        where: { userId },
        update: { currency: body.currency },
        create: { userId, currency: body.currency },
      });
    }

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    console.error('Error syncing user financial data:', error);
    return NextResponse.json({ error: 'Database sync failure' }, { status: 500 });
  }
}
