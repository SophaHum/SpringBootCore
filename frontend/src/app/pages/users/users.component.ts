import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableComponent, TableColumn } from '../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent, ModalComponent, IconComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  private toastService = inject(ToastService);

  columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true, type: 'avatar' },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true, type: 'badge', badgeColors: {
      'Admin': 'rgba(99, 102, 241, 0.15)',
      'Editor': 'rgba(139, 92, 246, 0.15)',
      'Viewer': 'rgba(59, 130, 246, 0.15)',
      'Manager': 'rgba(16, 185, 129, 0.15)',
    }},
    { key: 'status', label: 'Status', sortable: true, type: 'badge', badgeColors: {
      'Active': 'rgba(16, 185, 129, 0.15)',
      'Inactive': 'rgba(239, 68, 68, 0.15)',
      'Pending': 'rgba(245, 158, 11, 0.15)',
    }},
    { key: 'lastLogin', label: 'Last Login', sortable: true },
    { key: 'actions', label: 'Actions', type: 'actions', width: '100px' },
  ];

  users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', lastLogin: '2 min ago' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active', lastLogin: '1 hour ago' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Viewer', status: 'Inactive', lastLogin: '3 days ago' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Manager', status: 'Active', lastLogin: '5 min ago' },
    { id: 5, name: 'Tom Brown', email: 'tom@example.com', role: 'Editor', status: 'Pending', lastLogin: 'Never' },
    { id: 6, name: 'Emily Davis', email: 'emily@example.com', role: 'Viewer', status: 'Active', lastLogin: '30 min ago' },
    { id: 7, name: 'Chris Lee', email: 'chris@example.com', role: 'Admin', status: 'Active', lastLogin: '1 day ago' },
    { id: 8, name: 'Anna Martinez', email: 'anna@example.com', role: 'Editor', status: 'Active', lastLogin: '4 hours ago' },
    { id: 9, name: 'David Garcia', email: 'david@example.com', role: 'Viewer', status: 'Inactive', lastLogin: '1 week ago' },
    { id: 10, name: 'Lisa Anderson', email: 'lisa@example.com', role: 'Manager', status: 'Active', lastLogin: '10 min ago' },
    { id: 11, name: 'Robert Taylor', email: 'robert@example.com', role: 'Viewer', status: 'Active', lastLogin: '2 hours ago' },
    { id: 12, name: 'Jennifer Thomas', email: 'jennifer@example.com', role: 'Editor', status: 'Pending', lastLogin: 'Never' },
  ];

  showCreateModal = signal(false);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  selectedUser = signal<any>(null);

  newUser = {
    name: '',
    email: '',
    role: 'Viewer',
    status: 'Active'
  };

  onEdit(user: any): void {
    this.selectedUser.set({ ...user });
    this.showEditModal.set(true);
  }

  onDelete(user: any): void {
    this.selectedUser.set(user);
    this.showDeleteModal.set(true);
  }

  confirmDelete(): void {
    const user = this.selectedUser();
    if (user) {
      this.users = this.users.filter(u => u.id !== user.id);
      this.toastService.success('User deleted', `${user.name} has been removed.`);
    }
    this.showDeleteModal.set(false);
  }

  saveNewUser(): void {
    const id = Math.max(...this.users.map(u => u.id)) + 1;
    this.users = [...this.users, { ...this.newUser, id, lastLogin: 'Never' }];
    this.newUser = { name: '', email: '', role: 'Viewer', status: 'Active' };
    this.showCreateModal.set(false);
    this.toastService.success('User created', 'New user has been added successfully.');
  }

  saveEditUser(): void {
    const user = this.selectedUser();
    if (user) {
      this.users = this.users.map(u => u.id === user.id ? { ...user } : u);
      this.toastService.success('User updated', `${user.name}'s details have been saved.`);
    }
    this.showEditModal.set(false);
  }
}
