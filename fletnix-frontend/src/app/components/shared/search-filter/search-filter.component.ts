import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit {
  @Input() loading = false;
  @Input() totalItems = 0;
  @Output() searchChange = new EventEmitter<string>();
  @Output() typeChange = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<{sortBy: string, sortOrder: string}>();

  searchForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      search: [''],
      type: [''],
      sortBy: ['title'],
      sortOrder: ['asc']
    });

    // Debounce search input
    this.searchForm.get('search')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.searchChange.emit(value);
      });

    // Handle type filter changes
    this.searchForm.get('type')?.valueChanges.subscribe(value => {
      this.typeChange.emit(value);
    });

    // Handle sort changes
    this.searchForm.get('sortBy')?.valueChanges.subscribe(() => {
      this.emitSortChange();
    });

    this.searchForm.get('sortOrder')?.valueChanges.subscribe(() => {
      this.emitSortChange();
    });
  }

  private emitSortChange(): void {
    const sortBy = this.searchForm.get('sortBy')?.value;
    const sortOrder = this.searchForm.get('sortOrder')?.value;
    this.sortChange.emit({ sortBy, sortOrder });
  }

  clearFilters(): void {
    this.searchForm.patchValue({
      search: '',
      type: '',
      sortBy: 'title',
      sortOrder: 'asc'
    });
  }
}
