import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private authService = inject(AuthService);

  stats = [
    { label: 'Total Users', value: '2,847', change: '+12.5%', trend: 'up', icon: 'users', color: '#6366f1' },
    { label: 'Active Roles', value: '12', change: '+2', trend: 'up', icon: 'shield', color: '#8b5cf6' },
    { label: 'Permissions', value: '48', change: '0', trend: 'neutral', icon: 'key', color: '#3b82f6' },
    { label: 'Active Sessions', value: '1,024', change: '-3.2%', trend: 'down', icon: 'activity', color: '#10b981' },
  ];

  recentActivity = [
    { user: 'John Doe', action: 'Updated role permissions', time: '2 min ago', icon: 'shield' },
    { user: 'Jane Smith', action: 'Created new user account', time: '15 min ago', icon: 'user' },
    { user: 'Mike Johnson', action: 'Modified security settings', time: '1 hour ago', icon: 'settings' },
    { user: 'Sarah Wilson', action: 'Revoked API access token', time: '2 hours ago', icon: 'key' },
    { user: 'Tom Brown', action: 'Exported user data report', time: '3 hours ago', icon: 'download' },
  ];

  quickActions = [
    { label: 'Add User', icon: 'users', route: '/users', color: '#6366f1' },
    { label: 'Manage Roles', icon: 'shield', route: '/roles', color: '#8b5cf6' },
    { label: 'Permissions', icon: 'key', route: '/permissions', color: '#3b82f6' },
    { label: 'Settings', icon: 'settings', route: '/settings', color: '#10b981' },
  ];

  getUserName(): string {
    const user = this.authService.currentUserValue;
    return user?.name || user?.fullName || 'User';
  }
}
