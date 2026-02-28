import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast toast-{{ toast.type }}" [class.toast-exit]="false">
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') {
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fill="currentColor"/>
                </svg>
              }
              @case ('error') {
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" fill="currentColor"/>
                </svg>
              }
              @case ('warning') {
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" fill="currentColor"/>
                </svg>
              }
              @case ('info') {
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" fill="currentColor"/>
                </svg>
              }
            }
          </div>
          <div class="toast-content">
            <p class="toast-title">{{ toast.title }}</p>
            @if (toast.message) {
              <p class="toast-message">{{ toast.message }}</p>
            }
          </div>
          @if (toast.dismissible) {
            <button class="toast-close" (click)="toastService.dismiss(toast.id)">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z" fill="currentColor"/>
              </svg>
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 800;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 400px;
      width: calc(100% - 2rem);
    }

    .toast {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      border-radius: var(--radius-lg);
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-lg);
      animation: toastSlideIn 300ms cubic-bezier(0.22, 1, 0.36, 1);
      pointer-events: all;
    }

    .toast-success {
      border-left: 3px solid var(--color-success);
    }
    .toast-success .toast-icon { color: var(--color-success); }

    .toast-error {
      border-left: 3px solid var(--color-danger);
    }
    .toast-error .toast-icon { color: var(--color-danger); }

    .toast-warning {
      border-left: 3px solid var(--color-warning);
    }
    .toast-warning .toast-icon { color: var(--color-warning); }

    .toast-info {
      border-left: 3px solid var(--color-info);
    }
    .toast-info .toast-icon { color: var(--color-info); }

    .toast-icon {
      flex-shrink: 0;
      margin-top: 1px;
    }

    .toast-content {
      flex: 1;
      min-width: 0;
    }

    .toast-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0;
    }

    .toast-message {
      font-size: var(--font-size-xs);
      color: var(--color-text-secondary);
      margin: 0.25rem 0 0;
    }

    .toast-close {
      flex-shrink: 0;
      background: none;
      border: none;
      color: var(--color-text-tertiary);
      cursor: pointer;
      padding: 2px;
      border-radius: var(--radius-sm);
      transition: color var(--transition-fast), background var(--transition-fast);
    }

    .toast-close:hover {
      color: var(--color-text);
      background: var(--color-surface-hover);
    }

    @keyframes toastSlideIn {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
