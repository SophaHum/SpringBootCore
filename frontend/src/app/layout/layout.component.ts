import { Component, signal, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="layout" [class.sidebar-collapsed]="sidebarCollapsed()">
      <app-sidebar
        [collapsed]="sidebarCollapsed()"
        [mobileOpen]="mobileMenuOpen()"
        (collapsedChange)="sidebarCollapsed.set($event)"
        (mobileOpenChange)="mobileMenuOpen.set($event)"
      />

      <div class="layout-main">
        <app-header
          [pageTitle]="pageTitle()"
          (menuToggle)="mobileMenuOpen.set(!mobileMenuOpen())"
        />

        <main class="layout-content">
          <div class="page-enter">
            <router-outlet />
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      height: 100vh;
    }

    .layout-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: var(--sidebar-width);
      transition: margin-left var(--transition-slow);
      min-width: 0;
    }

    .sidebar-collapsed .layout-main {
      margin-left: var(--sidebar-collapsed-width);
    }

    .layout-content {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: var(--space-6);
      background: var(--color-bg);
      transition: background var(--transition-slow);
    }

    .page-enter {
      animation: pageEnter 400ms cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    @keyframes pageEnter {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }

    @media (max-width: 767px) {
      .layout-main {
        margin-left: 0;
      }

      .sidebar-collapsed .layout-main {
        margin-left: 0;
      }

      .layout-content {
        padding: var(--space-4);
      }
    }
  `]
})
export class LayoutComponent {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  sidebarCollapsed = signal(false);
  mobileMenuOpen = signal(false);
  pageTitle = signal('Dashboard');

  private routeTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/home': 'Home',
    '/users': 'User Management',
    '/profile': 'My Profile',
    '/roles': 'Role Management',
    '/permissions': 'Permission Management',
    '/settings': 'Settings',
  };

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const navEnd = event as NavigationEnd;
      const url = navEnd.urlAfterRedirects || navEnd.url;
      this.pageTitle.set(this.routeTitles[url] || 'Dashboard');

      // Close mobile menu on navigation
      this.mobileMenuOpen.set(false);
    });
  }
}
