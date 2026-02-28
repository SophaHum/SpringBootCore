import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AuthService } from '../../services/auth.service';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
  children?: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed" [class.mobile-open]="mobileOpen">
      <!-- Overlay for mobile -->
      <div class="sidebar-overlay" (click)="closeMobile()" [class.visible]="mobileOpen"></div>

      <nav class="sidebar-inner">
        <!-- Logo -->
        <div class="sidebar-header">
          <div class="logo">
            <div class="logo-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="8" fill="currentColor" opacity="0.15"/>
                <path d="M8 14l4 4 8-8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            @if (!collapsed) {
              <span class="logo-text">CoreApp</span>
            }
          </div>
          <button class="collapse-btn hide-mobile" (click)="toggleCollapse()">
            <app-icon [name]="collapsed ? 'chevron-right' : 'chevron-left'" [size]="16"/>
          </button>
        </div>

        <!-- Navigation -->
        <div class="sidebar-nav">
          <div class="nav-section">
            @if (!collapsed) {
              <span class="nav-section-title">Main</span>
            }
            @for (item of mainNav; track item.route) {
              <a
                class="nav-item"
                [routerLink]="item.route"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
                (click)="closeMobile()"
                [title]="collapsed ? item.label : ''"
              >
                <app-icon [name]="item.icon" [size]="20"/>
                @if (!collapsed) {
                  <span class="nav-label">{{ item.label }}</span>
                  @if (item.badge) {
                    <span class="nav-badge">{{ item.badge }}</span>
                  }
                }
              </a>
            }
          </div>

          <div class="nav-section">
            @if (!collapsed) {
              <span class="nav-section-title">Management</span>
            }
            @for (item of managementNav; track item.route) {
              <a
                class="nav-item"
                [routerLink]="item.route"
                routerLinkActive="active"
                (click)="closeMobile()"
                [title]="collapsed ? item.label : ''"
              >
                <app-icon [name]="item.icon" [size]="20"/>
                @if (!collapsed) {
                  <span class="nav-label">{{ item.label }}</span>
                }
              </a>
            }
          </div>

          <div class="nav-section">
            @if (!collapsed) {
              <span class="nav-section-title">System</span>
            }
            @for (item of systemNav; track item.route) {
              <a
                class="nav-item"
                [routerLink]="item.route"
                routerLinkActive="active"
                (click)="closeMobile()"
                [title]="collapsed ? item.label : ''"
              >
                <app-icon [name]="item.icon" [size]="20"/>
                @if (!collapsed) {
                  <span class="nav-label">{{ item.label }}</span>
                }
              </a>
            }
          </div>
        </div>

        <!-- User section at bottom -->
        <div class="sidebar-footer">
          <div class="user-card" (click)="closeMobile()">
            <div class="user-avatar">
              {{ getUserInitials() }}
            </div>
            @if (!collapsed) {
              <div class="user-info">
                <span class="user-name">{{ getUserName() }}</span>
                <span class="user-email">{{ getUserEmail() }}</span>
              </div>
            }
          </div>
        </div>
      </nav>
    </aside>
  `,
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Input() mobileOpen = false;
  @Output() collapsedChange = new EventEmitter<boolean>();
  @Output() mobileOpenChange = new EventEmitter<boolean>();

  private authService = inject(AuthService);

  mainNav: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Home', icon: 'home', route: '/home' },
  ];

  managementNav: NavItem[] = [
    { label: 'Users', icon: 'users', route: '/users' },
    { label: 'Roles', icon: 'shield', route: '/roles' },
    { label: 'Permissions', icon: 'key', route: '/permissions' },
  ];

  systemNav: NavItem[] = [
    { label: 'Settings', icon: 'settings', route: '/settings' },
  ];

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  closeMobile(): void {
    this.mobileOpen = false;
    this.mobileOpenChange.emit(false);
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
