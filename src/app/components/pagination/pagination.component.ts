import { Component, computed, inject, OnInit, output } from '@angular/core';
import { PaginationService } from './pagination.service';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnInit {
  private paginationService = inject(PaginationService)

  page = computed(() => this.paginationService.page())
  perPage = computed(() => this.paginationService.perPage())
  totalPages = computed(() => this.paginationService.totalPages())

  selectPerPage(event: Event) {
    const field = event.target as HTMLSelectElement;
    this.paginationService.changePerPage(+field.value);
    localStorage.setItem('perPage', field.value)
  }

  ngOnInit() {
    const perPageExists = localStorage.getItem('perPage')
    if (perPageExists) {
      this.paginationService.perPage.set(+perPageExists)
    }
  }

  onNext() {
    this.paginationService.nextPage();
  }

  onPrev() {
    if (this.page() > 1) {
      this.paginationService.previousPage();
    }
  }
}

