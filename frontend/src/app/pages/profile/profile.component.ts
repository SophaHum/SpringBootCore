import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  activeTab = signal<'profile' | 'security' | 'sessions'>('profile');
  saving = signal(false);
  avatarUrl = signal<string | null>(null);

  profile = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Full-stack developer passionate about building great products.',
    company: 'CoreApp Inc.',
    website: 'https://johndoe.dev',
  };

  security = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  sessions = [
    { id: 1, device: 'Chrome on macOS', ip: '192.168.1.100', location: 'San Francisco, CA', lastActive: 'Now', current: true, icon: 'monitor' },
    { id: 2, device: 'Safari on iPhone', ip: '192.168.1.101', location: 'San Francisco, CA', lastActive: '2 hours ago', current: false, icon: 'smartphone' },
    { id: 3, device: 'Firefox on Windows', ip: '10.0.0.50', location: 'New York, NY', lastActive: '1 day ago', current: false, icon: 'monitor' },
    { id: 4, device: 'Chrome on Android', ip: '172.16.0.25', location: 'Los Angeles, CA', lastActive: '3 days ago', current: false, icon: 'smartphone' },
  ];

  constructor() {
    const user = this.authService.currentUserValue;
    if (user) {
      this.profile.name = user.name || user.fullName || 'User';
      this.profile.email = user.email || user.username || '';
    }
  }

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarUrl.set(e.target?.result as string);
        this.toastService.success('Avatar updated', 'Your profile picture has been changed.');
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  saveProfile(): void {
    this.saving.set(true);
    setTimeout(() => {
      this.saving.set(false);
      this.toastService.success('Profile saved', 'Your profile has been updated successfully.');
    }, 1000);
  }

  changePassword(): void {
    if (this.security.newPassword !== this.security.confirmPassword) {
      this.toastService.error('Error', 'Passwords do not match.');
      return;
    }
    if (this.security.newPassword.length < 8) {
      this.toastService.error('Error', 'Password must be at least 8 characters.');
      return;
    }
    this.saving.set(true);
    setTimeout(() => {
      this.saving.set(false);
      this.security = { currentPassword: '', newPassword: '', confirmPassword: '' };
      this.toastService.success('Password changed', 'Your password has been updated.');
    }, 1000);
  }

  revokeSession(sessionId: number): void {
    this.sessions = this.sessions.filter(s => s.id !== sessionId);
    this.toastService.success('Session revoked', 'The device has been signed out.');
  }

  revokeAllSessions(): void {
    this.sessions = this.sessions.filter(s => s.current);
    this.toastService.success('All sessions revoked', 'All other devices have been signed out.');
  }

  getInitials(): string {
    return this.profile.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }
}
