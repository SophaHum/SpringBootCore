import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { ToastService } from '../../services/toast.service';

interface Role {
  id: number;
  name: string;
  description: string;
  usersCount: number;
  permissions: string[];
  color: string;
  isEditing?: boolean;
  editName?: string;
  editDescription?: string;
}

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ModalComponent],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent {
  private toastService = inject(ToastService);

  searchQuery = signal('');
  sortKey = signal('name');
  sortDir = signal<'asc' | 'desc'>('asc');
  showCreateModal = signal(false);
  showDeleteModal = signal(false);
  selectedRole = signal<Role | null>(null);

  newRole = { name: '', description: '', color: '#6366f1' };

  roles: Role[] = [
    { id: 1, name: 'Super Admin', description: 'Full system access with all permissions', usersCount: 2, permissions: ['all'], color: '#ef4444' },
    { id: 2, name: 'Admin', description: 'Administrative access to manage users and settings', usersCount: 5, permissions: ['users.manage', 'roles.manage', 'settings.manage'], color: '#6366f1' },
    { id: 3, name: 'Manager', description: 'Can manage team members and view reports', usersCount: 12, permissions: ['users.view', 'users.edit', 'reports.view'], color: '#8b5cf6' },
    { id: 4, name: 'Editor', description: 'Can create and edit content', usersCount: 24, permissions: ['content.create', 'content.edit', 'content.delete'], color: '#3b82f6' },
    { id: 5, name: 'Viewer', description: 'Read-only access to view content and reports', usersCount: 156, permissions: ['content.view', 'reports.view'], color: '#10b981' },
    { id: 6, name: 'Support', description: 'Customer support access with limited permissions', usersCount: 8, permissions: ['tickets.manage', 'users.view'], color: '#f59e0b' },
  ];

  get filteredRoles(): Role[] {
    let result = [...this.roles];
    const query = this.searchQuery().toLowerCase();

    if (query) {
      result = result.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query)
      );
    }

    const key = this.sortKey() as keyof Role;
    const dir = this.sortDir();
    result.sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal! < bVal!) return dir === 'asc' ? -1 : 1;
      if (aVal! > bVal!) return dir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }

  onSort(key: string): void {
    if (this.sortKey() === key) {
      this.sortDir.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
  }

  startEdit(role: Role): void {
    role.isEditing = true;
    role.editName = role.name;
    role.editDescription = role.description;
  }

  cancelEdit(role: Role): void {
    role.isEditing = false;
  }

  saveEdit(role: Role): void {
    if (role.editName && role.editDescription) {
      role.name = role.editName;
      role.description = role.editDescription;
      role.isEditing = false;
      this.toastService.success('Role updated', `${role.name} has been saved.`);
    }
  }

  confirmDelete(role: Role): void {
    this.selectedRole.set(role);
    this.showDeleteModal.set(true);
  }

  deleteRole(): void {
    const role = this.selectedRole();
    if (role) {
      this.roles = this.roles.filter(r => r.id !== role.id);
      this.toastService.success('Role deleted', `${role.name} has been removed.`);
    }
    this.showDeleteModal.set(false);
  }

  createRole(): void {
    const id = Math.max(...this.roles.map(r => r.id)) + 1;
    this.roles = [...this.roles, {
      id,
      name: this.newRole.name,
      description: this.newRole.description,
      usersCount: 0,
      permissions: [],
      color: this.newRole.color,
    }];
    this.newRole = { name: '', description: '', color: '#6366f1' };
    this.showCreateModal.set(false);
    this.toastService.success('Role created', 'New role has been added.');
  }
}
