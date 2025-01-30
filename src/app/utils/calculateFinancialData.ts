interface Expense {
    name: string;
    cost: string;
    description?: string;
  }

  export const calculateFinancialData = (
  income: number,
  expenses: Expense[],
  investmentPercentage: number
) => {
  const totalMonthlyExpenses = expenses.reduce(
    (total, expense) => total + parseFloat(expense.cost || "0"),
    0
  );

  let savings = 0;
  let investment = 0;
  let cumulativeExpenses = 0;
  const balanceData: number[] = [];
  const investmentData: number[] = [];
  const monthlyExpensesData: number[] = [];

  const monthlyInterestRate = 0.08 / 12; // 8% annual interest

  for (let i = 0; i < 12; i++) {
    // Add this month's expenses to cumulative total
    cumulativeExpenses += totalMonthlyExpenses;
    monthlyExpensesData.push(cumulativeExpenses);

    const netIncome = income - totalMonthlyExpenses;
    const investmentPortion = (investmentPercentage / 100) * netIncome;
    const savingsPortion = netIncome - investmentPortion;

    // Add to savings
    savings += savingsPortion;

    // Investment grows with interest
    investment = (investment + investmentPortion) * (1 + monthlyInterestRate);

    balanceData.push(parseFloat(savings.toFixed(2)));
    investmentData.push(parseFloat(investment.toFixed(2)));
  }

  return { balanceData, investmentData, monthlyExpensesData };
};

  