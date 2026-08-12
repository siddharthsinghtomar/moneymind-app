const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Purging past test user records and transactions from Supabase PostgreSQL database...');

  try {
    const deletedExpenses = await prisma.expense.deleteMany({});
    console.log(`Deleted ${deletedExpenses.count} expense records.`);

    const deletedIncomes = await prisma.income.deleteMany({});
    console.log(`Deleted ${deletedIncomes.count} income records.`);

    const deletedAccounts = await prisma.financialAccount.deleteMany({});
    console.log(`Deleted ${deletedAccounts.count} financial account records.`);

    const deletedBudgets = await prisma.budget.deleteMany({});
    console.log(`Deleted ${deletedBudgets.count} budget records.`);

    const deletedGoals = await prisma.goal.deleteMany({});
    console.log(`Deleted ${deletedGoals.count} goal records.`);

    const deletedInvestments = await prisma.investment.deleteMany({});
    console.log(`Deleted ${deletedInvestments.count} investment records.`);

    const deletedSettings = await prisma.userSettings.deleteMany({});
    console.log(`Deleted ${deletedSettings.count} user settings records.`);

    const deletedUsers = await prisma.user.deleteMany({});
    console.log(`Deleted ${deletedUsers.count} past user accounts.`);

    console.log('Database wipe completed successfully! PostgreSQL is completely clean for real users.');
  } catch (err) {
    console.error('Error clearing database:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
