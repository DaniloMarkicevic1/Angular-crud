import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ExpensesService } from './expenses.service';
import { InputComponent } from '../../components/input/input.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { AppService } from '../../app.service';
import { Subscription } from 'rxjs';
import { Expense } from './expenses.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { PaginationComponent } from '@/app/components/pagination/pagination.component';
import { PaginationService } from '@/app/components/pagination/pagination.service';

@Component({
  selector: 'app-expenses',
  imports: [ReactiveFormsModule, InputComponent, DatePipe, CurrencyPipe, PaginationComponent],
  providers: [DatePipe],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent implements OnInit, OnDestroy {
  @ViewChild('myDialog') myDialog!: ElementRef<HTMLDialogElement>;

  datePipe = inject(DatePipe)

  private expensesService = inject(ExpensesService);
  private appService = inject(AppService);
  private paginationService = inject(PaginationService);

  currentPageSubscription: Subscription | undefined;
  userIdSubscription: Subscription | undefined;
  perPageSubscription: Subscription | undefined;

  expensesList = computed(() => this.expensesService.expensesList());
  isLoading = computed(() => this.expensesService.isLoading());

  nnfb = new FormBuilder().nonNullable;

  formatedDate = this.datePipe.transform(new Date(), 'YYYY-MM-dd') || ""
  expensesFormGroup = this.nnfb.group({
    name: ['', Validators.required],
    price: [0, Validators.min(1)],
    amount: [0, Validators.min(1)],
    date: [this.formatedDate, Validators.required],
  });

  isEdit = signal(false);
  selectedUserId = signal(0);
  selectedExpenseId = signal(0);

  toggleDialog() {
    this.myDialog.nativeElement.showModal();
  }

  ngOnInit(): void {
    this.currentPageSubscription = this.paginationService.currentPageToObservable.subscribe({
      next: (value) => {
        if (this.appService.loggedInUserId() !== 0) {
          this.expensesService.fetchExpenses({ page: value, pageSize: this.paginationService.perPage() });
        }
      }
    })

    this.perPageSubscription = this.paginationService.currentPerPageToObservable.subscribe({
      next: (value) => {
        if (this.appService.loggedInUserId() !== 0) {
          this.expensesService.fetchExpenses({ page: this.paginationService.page(), pageSize: value });
        }
      }
    })

    this.userIdSubscription = this.appService.userIdToObservable.subscribe({
      next: (value) => {
        if (value !== 0) {
          this.expensesService.fetchExpenses({ page: 1, pageSize: this.paginationService.perPage() });
        }
      },
    });

  }

  onDelete(id: number) {
    this.expensesService.deleteExpense({ expenseId: id })
  }

  onAdd() {
    this.isEdit.set(false)
    this.selectedExpenseId.set(0)
    this.selectedUserId.set(0)

    this.toggleDialog();
  }

  onEdit(expense: Expense) {
    this.isEdit.set(true)
    this.selectedExpenseId.set(expense.id)
    this.selectedUserId.set(expense.user_id)
    const { date, name, amount, price } = expense

    this.expensesFormGroup.setValue({ date, name, amount, price })
    this.toggleDialog();
  }

  onCloseModal() {
    this.myDialog.nativeElement.close();
    this.expensesFormGroup.reset();
  }

  onSubmit() {
    if (!this.expensesFormGroup.value || !this.expensesFormGroup.valid) return;
    const date = this.expensesFormGroup.value.date!;

    this.expensesFormGroup.setValue({
      name: this.expensesFormGroup.value.name || '',
      date: date,
      amount: this.expensesFormGroup.value.amount || 0,
      price: this.expensesFormGroup.value.price || 0,
    });

    if (this.isEdit()) {
      this.expensesService.editExpense({
        ...this.expensesFormGroup.getRawValue(),
        id: this.selectedExpenseId(),
        userId: this.selectedUserId()
      })
    }
    if (!this.isEdit()) {
      this.expensesService.createExpense({ ...this.expensesFormGroup.getRawValue() })
    }

    this.onCloseModal();
  }

  ngOnDestroy() {
    this.userIdSubscription?.unsubscribe();
    this.currentPageSubscription?.unsubscribe()
    this.perPageSubscription?.unsubscribe()
  }
}
