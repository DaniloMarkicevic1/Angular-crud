import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CreateExpenseRequest, ExpensesResponse, Expense, EditExpense } from './expenses.model';
import { AppService } from '../../app.service';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  private http = inject(HttpClient);
  private appService = inject(AppService)
  expensesList = signal<Expense[]>([]);

  private fetchExpensesUrl = environment.apiUrl + '/expenses';
  private crudExpenseUrl = environment.apiUrl + '/expense';

  fetchExpenses({ page = 1, pageSize = 10 }: { page?: number, pageSize?: number }) {
    this.http.get<ExpensesResponse>(this.fetchExpensesUrl, { params: { userId: this.appService.loggedInUserId(), page, pageSize } }).subscribe({
      next: (value) => this.expensesList.set(value.expenses),
      error: (err) => console.log(err)
    })
  }

  createExpense(request: CreateExpenseRequest) {
    this.http.post(this.crudExpenseUrl, { ...request, userId: this.appService.loggedInUserId() }).subscribe({
      next: (value) => value && this.fetchExpenses({}),
      error: (err) => console.log(err)
    })
  }

  deleteExpense(request: { expenseId: number }) {
    this.http.delete(this.crudExpenseUrl, { body: { ...request } }).subscribe({
      next: (value) => value && this.fetchExpenses({}),
      error: (err) => console.log(err)
    })
  }

  editExpense(request: EditExpense) {
    this.http.patch(this.crudExpenseUrl, { ...request }).subscribe({
      next: (value) => value && this.fetchExpenses({}),
      error: (err) => console.log(err)
    })
  }
}
