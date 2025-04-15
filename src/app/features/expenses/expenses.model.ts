export type CreateExpenseRequest = {
  date: string;
  name: string;
  amount: number;
  price: number;
}

export type GetExpensesResponse = {
  success: true,
  expenses: Expense[],
  currentPage: number,
  totalPages: number,
  totalCount: {
    count: number,
  }
}

export type Expense = {
  id: number;
  user_id: number;
  name: string;
  price: number;
  amount: number;
  date: string
}

export type EditExpense = CreateExpenseRequest & { id: number, userId: number }

export type ExpensesResponse = {
  success: boolean;
  expenses: Expense[]
}
