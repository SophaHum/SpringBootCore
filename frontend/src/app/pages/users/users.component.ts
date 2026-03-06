import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableComponent, TableColumn } from '../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ToastService } from '../../services/toast.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent, ModalComponent, IconComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  private toastService = inject(ToastService);
  private apiService = inject(ApiService);

  columns: TableColumn[] = [
    { key: 'fullName', label: 'Name', sortable: true, type: 'avatar' },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'roles', label: 'Role', sortable: true, type: 'badge', badgeColors: {
      'Admin': 'rgba(99, 102, 241, 0.15)',
      'Editor': 'rgba(139, 92, 246, 0.15)',
      'Viewer': 'rgba(59, 130, 246, 0.15)',
      'Manager': 'rgba(16, 185, 129, 0.15)',
    }},
    { key: 'status', label: 'Status', sortable: true, type: 'badge', badgeColors: {
      'Active': 'rgba(16, 185, 129, 0.15)',
      'Inactive': 'rgba(239, 68, 68, 0.15)',
    }},
    { key: 'enabled', label: 'Enabled', type: 'toggle' },
    { key: 'lastLoginAt', label: 'Last Login', sortable: true },
    { key: 'actions', label: 'Actions', type: 'actions', width: '100px' },
  ];

  users = signal<any[]>([]);

  showCreateModal = signal(false);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  selectedUser = signal<any>(null);

  newUser = {
    name: '',
    email: '',
    roleIds: [3], // Default to Viewer role ID
    password: 'password123', // Default password for new users in this demo
    status: 'Active'
  };

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.apiService.get<any[]>('users').subscribe({
      next: (data) => {
        // Map roles to a string for display if needed by the DataTable
        const processedData = data.map(user => ({
          ...user,
          roles: user.roles?.map((r: any) => r.name).join(', ') || 'Viewer',
          enabled: user.status === 'Active'
        }));
        this.users.set(processedData);
      },
      error: (err) => this.toastService.error('Error', 'Failed to load users')
    });
  }

  onEdit(user: any): void {
    this.selectedUser.set({ ...user });
    this.showEditModal.set(true);
  }

  onDelete(user: any): void {
    this.selectedUser.set(user);
    this.showDeleteModal.set(true);
  }

  toggleStatus(user: any): void {
    this.apiService.toggleUserStatus(user.id).subscribe({
      next: () => {
        this.toastService.success('Status Updated', `Status for ${user.fullName} has been toggled.`);
        this.loadUsers();
      },
      error: () => this.toastService.error('Error', 'Failed to toggle status')
    });
  }

  onToggleStatus(event: { row: any, key: string }): void {
    if (event.key === 'enabled') {
      this.toggleStatus(event.row);
    }
  }

  confirmDelete(): void {
    const user = this.selectedUser();
    if (user) {
      this.apiService.delete(`users/${user.id}`).subscribe({
        next: () => {
          this.toastService.success('User deleted', `${user.fullName} has been removed.`);
          this.loadUsers();
          this.showDeleteModal.set(false);
        },
        error: () => this.toastService.error('Error', 'Failed to delete user')
      });
    }
  }

  saveNewUser(): void {
    this.apiService.post('users', this.newUser).subscribe({
      next: () => {
        this.toastService.success('User created', 'New user has been added successfully.');
        this.loadUsers();
        this.showCreateModal.set(false);
        this.newUser = { name: '', email: '', roleIds: [3], password: 'password123', status: 'Active' };
      },
      error: () => this.toastService.error('Error', 'Failed to create user')
    });
  }

  saveEditUser(): void {
    const user = this.selectedUser();
    if (user) {
      // Prepare the request body expected by UserRequest DTO
      const updateRequest = {
        name: user.fullName,
        email: user.email,
        status: user.status,
        roleIds: user.roleIds || user.roles_list?.map((r: any) => r.id) // Assuming role IDs are available
      };

      this.apiService.put(`users/${user.id}`, updateRequest).subscribe({
        next: () => {
          this.toastService.success('User updated', `${user.fullName}'s details have been saved.`);
          this.loadUsers();
          this.showEditModal.set(false);
        },
        error: () => this.toastService.error('Error', 'Failed to update user')
      });
    }
  }
}
