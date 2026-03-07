import { Component, Input, Output, EventEmitter, HostListener, OnInit, OnDestroy, ElementRef, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    @if (isOpen) {
      <div class="modal-backdrop" (click)="onBackdropClick($event)">
        <div class="modal-container" [class]="'modal-' + size" role="dialog" aria-modal="true">
          <div class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button class="modal-close" (click)="close.emit()">
              <app-icon name="x" [size]="18"/>
            </button>
          </div>
          <div class="modal-body">
            <ng-content />
          </div>
          @if (showFooter) {
            <div class="modal-footer">
              <ng-content select="[modal-footer]" />
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: var(--color-bg-overlay);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: var(--z-modal-backdrop);
      padding: var(--space-4);
      animation: backdropIn 200ms ease-out;
    }

    .modal-container {
      background: var(--color-bg-elevated);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-2xl);
      width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      animation: modalIn 300ms cubic-bezier(0.22, 1, 0.36, 1);
      z-index: var(--z-modal);
    }

    .modal-sm { max-width: 400px; }
    .modal-md { max-width: 560px; }
    .modal-lg { max-width: 720px; }
    .modal-xl { max-width: 960px; }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-5) var(--space-6);
      border-bottom: 1px solid var(--color-border);
      flex-shrink: 0;
    }

    .modal-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0;
    }

    .modal-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      color: var(--color-text-tertiary);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .modal-close:hover {
      background: var(--color-surface-hover);
      color: var(--color-text);
    }

    .modal-body {
      padding: var(--space-6);
      overflow-y: auto;
      flex: 1;
    }

    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--space-3);
      padding: var(--space-4) var(--space-6);
      border-top: 1px solid var(--color-border);
      flex-shrink: 0;
    }

    @keyframes backdropIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes modalIn {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(10px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `]
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() showFooter = true;
  @Output() close = new EventEmitter<void>();

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Move the component element to the body root to break stacking context
      this.renderer.appendChild(this.document.body, this.elementRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Clean up when component is destroyed
      const nativeElement = this.elementRef.nativeElement;
      if (nativeElement && nativeElement.parentNode) {
        this.renderer.removeChild(nativeElement.parentNode, nativeElement);
      }
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) {
      this.close.emit();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
