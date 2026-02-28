import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  type?: 'text' | 'badge' | 'avatar' | 'actions' | 'toggle' | 'date';
  badgeColors?: Record<string, string>;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="table-wrapper">
      <!-- Table Header Controls -->
      <div class="table-controls">
        <div class="table-search">
          <app-icon name="search" [size]="16"/>
          <input
            type="text"
            class="table-search-input"
            [placeholder]="searchPlaceholder"
            [ngModel]="searchQuery()"
            (ngModelChange)="onSearch($event)"
          />
        </div>
        <div class="table-actions">
          <ng-content select="[table-actions]" />
        </div>
      </div>

      <!-- Table -->
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              @for (col of columns; track col.key) {
                <th
                  [style.width]="col.width || 'auto'"
                  [class.sortable]="col.sortable"
                  (click)="col.sortable ? onSort(col.key) : null"
                >
                  <div class="th-content">
                    <span>{{ col.label }}</span>
                    @if (col.sortable) {
                      <span class="sort-icon" [class.active]="sortKey() === col.key">
                        @if (sortKey() === col.key && sortDir() === 'asc') {
                          ↑
                        } @else if (sortKey() === col.key && sortDir() === 'desc') {
                          ↓
                        } @else {
                          ↕
                        }
                      </span>
                    }
                  </div>
                </th>
              }
            </tr>
          </thead>
          <tbody>
            @if (loading) {
              @for (i of skeletonRows; track i) {
                <tr class="skeleton-row">
                  @for (col of columns; track col.key) {
                    <td>
                      <div class="skeleton skeleton-text" [style.width]="getSkeletonWidth()"></div>
                    </td>
                  }
                </tr>
              }
            } @else if (filteredData().length === 0) {
              <tr>
                <td [attr.colspan]="columns.length" class="empty-state">
                  <div class="empty-content">
                    <app-icon name="search" [size]="40"/>
                    <p>No results found</p>
                  </div>
                </td>
              </tr>
            } @else {
              @for (row of paginatedData(); track trackByFn(row); let i = $index) {
                <tr class="data-row" [class.animate-fade-in-up]="true" [style.animation-delay]="(i * 30) + 'ms'">
                  @for (col of columns; track col.key) {
                    <td>
                      @switch (col.type) {
                        @case ('badge') {
                          <span class="badge" [style.background]="getBadgeColor(row[col.key], col)">
                            {{ row[col.key] }}
                          </span>
                        }
                        @case ('avatar') {
                          <div class="cell-avatar">
                            <div class="mini-avatar">{{ getInitials(row[col.key]) }}</div>
                            <span>{{ row[col.key] }}</span>
                          </div>
                        }
                        @case ('toggle') {
                          <label class="toggle">
                            <input type="checkbox" [checked]="row[col.key]" (change)="onToggle(row, col.key)"/>
                            <span class="toggle-slider"></span>
                          </label>
                        }
                        @case ('date') {
                          <span class="cell-date">{{ row[col.key] | date:'medium' }}</span>
                        }
                        @case ('actions') {
                          <div class="cell-actions">
                            <button class="action-btn" title="Edit" (click)="edit.emit(row)">
                              <app-icon name="edit" [size]="15"/>
                            </button>
                            <button class="action-btn danger" title="Delete" (click)="delete.emit(row)">
                              <app-icon name="trash" [size]="15"/>
                            </button>
                          </div>
                        }
                        @default {
                          <span class="cell-text">{{ row[col.key] }}</span>
                        }
                      }
                    </td>
                  }
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      @if (!loading && filteredData().length > 0) {
        <div class="table-pagination">
          <span class="pagination-info">
            Showing {{ paginationStart() }} to {{ paginationEnd() }} of {{ filteredData().length }} entries
          </span>
          <div class="pagination-controls">
            <button
              class="pagination-btn"
              [disabled]="currentPage() === 1"
              (click)="goToPage(currentPage() - 1)"
            >
              <app-icon name="chevron-left" [size]="16"/>
            </button>
            @for (page of visiblePages(); track page) {
              <button
                class="pagination-btn"
                [class.active]="page === currentPage()"
                (click)="goToPage(page)"
              >
                {{ page }}
              </button>
            }
            <button
              class="pagination-btn"
              [disabled]="currentPage() === totalPages()"
              (click)="goToPage(currentPage() + 1)"
            >
              <app-icon name="chevron-right" [size]="16"/>
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './data-table.component.css'
})
export class DataTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() loading = false;
  @Input() searchPlaceholder = 'Search...';
  @Input() pageSize = 10;
  @Input() trackByKey = 'id';

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() toggleChange = new EventEmitter<{ row: any; key: string }>();

  searchQuery = signal('');
  sortKey = signal('');
  sortDir = signal<'asc' | 'desc'>('asc');
  currentPage = signal(1);

  skeletonRows = Array.from({ length: 5 }, (_, i) => i);

  filteredData = computed(() => {
    let result = [...this.data];
    const query = this.searchQuery().toLowerCase();

    if (query) {
      result = result.filter(row =>
        Object.values(row).some(val =>
          String(val).toLowerCase().includes(query)
        )
      );
    }

    const key = this.sortKey();
    const dir = this.sortDir();
    if (key) {
      result.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        if (aVal < bVal) return dir === 'asc' ? -1 : 1;
        if (aVal > bVal) return dir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  });

  totalPages = computed(() => Math.ceil(this.filteredData().length / this.pageSize) || 1);

  paginatedData = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredData().slice(start, start + this.pageSize);
  });

  paginationStart = computed(() => {
    if (this.filteredData().length === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize + 1;
  });

  paginationEnd = computed(() => {
    return Math.min(this.currentPage() * this.pageSize, this.filteredData().length);
  });

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  });

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }

  onSort(key: string): void {
    if (this.sortKey() === key) {
      this.sortDir.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  onToggle(row: any, key: string): void {
    this.toggleChange.emit({ row, key });
  }

  trackByFn(row: any): any {
    return row[this.trackByKey] ?? row;
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getBadgeColor(value: string, col: TableColumn): string {
    if (col.badgeColors && col.badgeColors[value]) {
      return col.badgeColors[value];
    }
    return 'var(--color-primary-light)';
  }

  getSkeletonWidth(): string {
    const widths = ['60%', '80%', '45%', '70%', '55%'];
    return widths[Math.floor(Math.random() * widths.length)];
  }
}
