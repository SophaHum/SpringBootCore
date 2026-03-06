import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private toastService = inject(ToastService);

  activeTab = signal<'profile' | 'security' | 'sessions'>('profile');
  saving = signal(false);
  avatarUrl = signal<string | null>(null);

  // Mutable form object for [(ngModel)]
  profileForm = {
    id: null as number | null,
    fullName: '',
    email: '',
    status: '',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Full-stack developer passionate about building great products.',
    company: 'CoreApp Inc.',
    website: 'https://johndoe.dev',
  };

  profileData = signal<any>(null);

  security = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  sessions = signal<any[]>([
    { id: 1, device: 'Chrome on macOS', ip: '192.168.1.100', location: 'San Francisco, CA', lastActive: 'Now', current: true, icon: 'monitor' },
    { id: 2, device: 'Safari on iPhone', ip: '192.168.1.101', location: 'San Francisco, CA', lastActive: '2 hours ago', current: false, icon: 'smartphone' },
  ]);

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.apiService.getUserProfile().subscribe({
      next: (user) => {
        this.profileData.set(user);
        this.profileForm = {
          ...this.profileForm,
          id: user.id || user.username, // some backends might return username as ID mapping
          fullName: user.fullName || user.name || user.username,
          email: user.email,
          status: user.status
        };
        // Also handle numeric ID if it exists
        if (typeof user.id === 'number') this.profileForm.id = user.id;
      },
      error: () => this.toastService.error('Error', 'Failed to load profile')
    });
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
    const updateRequest = {
      name: this.profileForm.fullName,
      email: this.profileForm.email,
      status: this.profileForm.status
    };
    
    // We need an ID for the update. If its missing we use 0 or something but usually profile returns ID.
    const userId = this.profileForm.id;
    if (userId === null) {
       this.toastService.error('Error', 'User ID is missing');
       this.saving.set(false);
       return;
    }

    this.apiService.updateUser(userId as any, updateRequest).subscribe({
      next: () => {
        this.saving.set(false);
        this.toastService.success('Profile saved', 'Your profile has been updated successfully.');
        this.loadProfile();
      },
      error: () => {
        this.saving.set(false);
        this.toastService.error('Error', 'Failed to update profile');
      }
    });
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
    
    const updateRequest = {
      name: this.profileForm.fullName,
      email: this.profileForm.email,
      status: this.profileForm.status,
      password: this.security.newPassword
    };

    const userId = this.profileForm.id;
    this.apiService.updateUser(userId as any, updateRequest).subscribe({
      next: () => {
        this.saving.set(false);
        this.security = { currentPassword: '', newPassword: '', confirmPassword: '' };
        this.toastService.success('Password changed', 'Your password has been updated.');
      },
      error: () => {
        this.saving.set(false);
        this.toastService.error('Error', 'Failed to change password');
      }
    });
  }

  revokeSession(sessionId: number): void {
    this.sessions.update(s => s.filter(x => x.id !== sessionId));
    this.toastService.success('Session revoked', 'The device has been signed out.');
  }

  revokeAllSessions(): void {
    this.sessions.update(s => s.filter(x => x.current));
    this.toastService.success('All sessions revoked', 'All other devices have been signed out.');
  }

  getInitials(): string {
    return (this.profileForm.fullName || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
  }
}
