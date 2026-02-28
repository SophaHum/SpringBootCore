import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ThemeService } from '../../services/theme.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  themeService = inject(ThemeService);
  private toastService = inject(ToastService);

  activeSection = signal('general');
  saving = signal(false);
  saveSuccess = signal(false);

  sections = [
    { key: 'general', label: 'General', icon: 'settings' },
    { key: 'notifications', label: 'Notifications', icon: 'bell' },
    { key: 'security', label: 'Security', icon: 'shield' },
    { key: 'appearance', label: 'Appearance', icon: 'sun' },
    { key: 'oauth', label: 'OAuth2 / SSO', icon: 'link' },
  ];

  general = {
    appName: 'CoreApp',
    appUrl: 'https://app.coreapp.dev',
    supportEmail: 'support@coreapp.dev',
    timezone: 'UTC',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
  };

  notifications = {
    emailNotifications: true,
    pushNotifications: true,
    securityAlerts: true,
    weeklyDigest: false,
    marketingEmails: false,
    loginAlerts: true,
    newUserAlerts: true,
    systemUpdates: true,
  };

  security = {
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    maxLoginAttempts: 5,
    ipWhitelist: false,
    auditLogging: true,
    forcePasswordChange: false,
  };

  appearance = {
    theme: 'system',
    sidebarCollapsed: false,
    compactMode: false,
    animationsEnabled: true,
    fontSize: 'medium',
  };

  oauth = {
    enabled: false,
    googleEnabled: false,
    googleClientId: '',
    googleClientSecret: '',
    githubEnabled: false,
    githubClientId: '',
    githubClientSecret: '',
  };

  save(section: string): void {
    this.saving.set(true);
    this.saveSuccess.set(false);

    setTimeout(() => {
      this.saving.set(false);
      this.saveSuccess.set(true);
      this.toastService.success('Settings saved', `${section} settings have been updated.`);

      setTimeout(() => this.saveSuccess.set(false), 2000);
    }, 800);
  }

  onThemeChange(theme: string): void {
    this.appearance.theme = theme;
    if (theme === 'dark') {
      this.themeService.setTheme('dark');
    } else if (theme === 'light') {
      this.themeService.setTheme('light');
    } else {
      // System preference
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      this.themeService.setTheme(prefersDark ? 'dark' : 'light');
    }
  }
}
