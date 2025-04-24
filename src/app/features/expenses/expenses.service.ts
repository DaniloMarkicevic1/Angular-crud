import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CreateExpenseRequest, Expense, EditExpense, GetExpensesResponse } from './expenses.model';
import { AppService } from '../../app.service';
import { PaginationService } from '@/app/components/pagination/pagination.service';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  private http = inject(HttpClient);
  private appService = inject(AppService)
  private paginationService = inject(PaginationService)

  expensesList = signal<Expense[]>([]);
  isLoading = signal<boolean>(true)

  private fetchExpensesUrl = environment.apiUrl + '/expenses';
  private crudExpenseUrl = environment.apiUrl + '/expense';

  fetchHelper(value: Object) {
    value && this.fetchExpenses({ page: this.paginationService.page(), pageSize: this.paginationService.perPage() })
  }

  fetchExpenses({ page = 1, pageSize = 10 }: { page?: number, pageSize?: number }) {
    this.isLoading.set(true)

    this.http.get<GetExpensesResponse>(this.fetchExpensesUrl, { params: { userId: this.appService.loggedInUserId(), page, pageSize } }).subscribe({
      next: (value) => {
        if (value.expenses.length === 0 && page !== 1) {
          this.paginationService.page.update((prev) => prev - 1)
        }

        if (value.totalCount.count !== this.paginationService.totalCount()) {
          this.paginationService.totalCount.set(value.totalCount.count)
        }

        this.expensesList.set(value.expenses);

        if (this.paginationService.totalPages() !== value.totalPages) {
          this.paginationService.totalPages.set(value.totalPages)
        }

        this.isLoading.set(false)
      },
      error: (err) => {
        this.isLoading.set(false)
        console.log(err)
      }
    })
  }

  createExpense(request: CreateExpenseRequest) {
    this.http.post(this.crudExpenseUrl, { ...request, userId: this.appService.loggedInUserId() }).subscribe({
      next: (value) => this.fetchHelper(value),
      error: (err) => console.log(err)
    })
  }

  deleteExpense(request: { expenseId: number }) {
    this.http.delete(this.crudExpenseUrl, { body: { ...request } }).subscribe({
      next: (value) => this.fetchHelper(value),
      error: (err) => console.log(err)
    })
  }

  editExpense(request: EditExpense) {
    this.http.patch(this.crudExpenseUrl, { ...request }).subscribe({
      next: (value) => this.fetchHelper(value),
      error: (err) => console.log(err)
    })
  }
}
