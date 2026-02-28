import { Component, Input, Output, EventEmitter, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <header class="header">
      <div class="header-left">
        <button class="icon-btn mobile-menu-btn hide-desktop" (click)="menuToggle.emit()">
          <app-icon name="menu" [size]="22"/>
        </button>
        <div class="breadcrumb">
          <span class="breadcrumb-text">{{ pageTitle }}</span>
        </div>
      </div>

      <div class="header-right">
        <!-- Search -->
        <div class="search-wrapper hide-mobile">
          <app-icon name="search" [size]="16"/>
          <input
            type="text"
            class="search-input"
            placeholder="Search..."
            (focus)="searchFocused.set(true)"
            (blur)="searchFocused.set(false)"
          />
          <kbd class="search-kbd">⌘K</kbd>
        </div>

        <!-- Theme Toggle -->
        <button class="icon-btn theme-toggle" (click)="themeService.toggle()" title="Toggle theme">
          <div class="theme-icon-wrapper">
            @if (themeService.isDark()) {
              <app-icon name="sun" [size]="18"/>
            } @else {
              <app-icon name="moon" [size]="18"/>
            }
          </div>
        </button>

        <!-- Notifications -->
        <button class="icon-btn notification-btn" (click)="toggleNotifications()">
          <app-icon name="bell" [size]="18"/>
          <span class="notification-dot"></span>
        </button>

        <!-- User Menu -->
        <div class="user-menu-wrapper">
          <button class="user-menu-trigger" (click)="toggleUserMenu()">
            <div class="header-avatar">
              {{ getUserInitials() }}
            </div>
            <app-icon name="chevron-down" [size]="14" class="hide-mobile"/>
          </button>

          @if (userMenuOpen()) {
            <div class="dropdown-menu" (click)="userMenuOpen.set(false)">
              <div class="dropdown-header">
                <span class="dropdown-name">{{ getUserName() }}</span>
                <span class="dropdown-email">{{ getUserEmail() }}</span>
              </div>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" routerLink="/profile">
                <app-icon name="user" [size]="16"/>
                <span>Profile</span>
              </a>
              <a class="dropdown-item" routerLink="/settings">
                <app-icon name="settings" [size]="16"/>
                <span>Settings</span>
              </a>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item danger" (click)="logout()">
                <app-icon name="log-out" [size]="16"/>
                <span>Sign out</span>
              </button>
            </div>
          }
        </div>
      </div>
    </header>
  `,
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() pageTitle = 'Dashboard';
  @Output() menuToggle = new EventEmitter<void>();

  themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private router = inject(Router);

  searchFocused = signal(false);
  userMenuOpen = signal(false);
  notificationsOpen = signal(false);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-wrapper')) {
      this.userMenuOpen.set(false);
    }
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update(v => !v);
  }

  toggleNotifications(): void {
    this.notificationsOpen.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getUserName(): string {
    const user = this.authService.currentUserValue;
    return user?.name || user?.fullName || 'User';
  }

  getUserEmail(): string {
    const user = this.authService.currentUserValue;
    return user?.email || user?.username || '';
  }

  getUserInitials(): string {
    const name = this.getUserName();
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
  }
}
