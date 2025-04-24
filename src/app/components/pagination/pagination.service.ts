import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  page = signal(1)
  totalPages = signal(1)
  perPage = signal(10)
  totalCount = signal(0);

  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.update(prev => prev + 1)
    }
  }

  previousPage() {
    if (this.page() > 1) {
      this.page.update(prev => prev - 1)
    }
  }

  changePerPage(value: number) {
    this.page.set(1)
    this.perPage.set(value)
  }

  currentPageToObservable = toObservable(this.page);
  currentPerPageToObservable = toObservable(this.perPage);
  currentTotalCountToObservable = toObservable(this.totalCount);
}
