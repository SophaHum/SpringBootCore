import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);

  stats = signal<any[]>([
    { label: 'Total Users', value: '...', change: '...', trend: 'neutral', icon: 'users', color: '#6366f1' },
    { label: 'Active Roles', value: '...', change: '...', trend: 'neutral', icon: 'shield', color: '#8b5cf6' },
    { label: 'Permissions', value: '...', change: '...', trend: 'neutral', icon: 'key', color: '#3b82f6' },
    { label: 'Active Sessions', value: '...', change: '...', trend: 'neutral', icon: 'activity', color: '#10b981' },
  ]);

  recentActivity = signal<any[]>([]);

  quickActions = [
    { label: 'Add User', icon: 'users', route: '/users', color: '#6366f1' },
    { label: 'Manage Roles', icon: 'shield', route: '/roles', color: '#8b5cf6' },
    { label: 'Permissions', icon: 'key', route: '/permissions', color: '#3b82f6' },
    { label: 'Settings', icon: 'settings', route: '/settings', color: '#10b981' },
  ];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.apiService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats.set([
          { label: 'Total Users', value: data.totalUsers.toString(), change: '+12.5%', trend: 'up', icon: 'users', color: '#6366f1' },
          { label: 'Active Roles', value: data.activeRoles.toString(), change: '+2', trend: 'up', icon: 'shield', color: '#8b5cf6' },
          { label: 'Permissions', value: data.totalPermissions.toString(), change: '0', trend: 'neutral', icon: 'key', color: '#3b82f6' },
          { label: 'Active Sessions', value: data.activeSessions.toString(), change: '-3.2%', trend: 'down', icon: 'activity', color: '#10b981' },
        ]);
      }
    });

    this.apiService.getDashboardActivity().subscribe({
      next: (data) => {
        this.recentActivity.set(data);
      }
    });
  }

  getUserName(): string {
    const user = this.authService.currentUserValue;
    return user?.name || user?.fullName || 'User';
  }
}
