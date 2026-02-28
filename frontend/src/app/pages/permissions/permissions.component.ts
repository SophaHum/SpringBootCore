import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { ToastService } from '../../services/toast.service';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface PermissionMatrix {
  [roleId: string]: { [permId: string]: boolean };
}

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ModalComponent],
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent {
  private toastService = inject(ToastService);

  activeView = signal<'matrix' | 'tree'>('matrix');
  showCreateModal = signal(false);
  saving = signal(false);

  newPermission = { name: '', description: '', category: 'users' };

  roles = [
    { id: 'super_admin', name: 'Super Admin', color: '#ef4444' },
    { id: 'admin', name: 'Admin', color: '#6366f1' },
    { id: 'manager', name: 'Manager', color: '#8b5cf6' },
    { id: 'editor', name: 'Editor', color: '#3b82f6' },
    { id: 'viewer', name: 'Viewer', color: '#10b981' },
  ];

  categories = [
    { key: 'users', label: 'User Management', icon: 'users' },
    { key: 'roles', label: 'Role Management', icon: 'shield' },
    { key: 'content', label: 'Content', icon: 'file-text' },
    { key: 'settings', label: 'Settings', icon: 'settings' },
    { key: 'reports', label: 'Reports', icon: 'bar-chart' },
  ];

  permissions: Permission[] = [
    { id: 'users.view', name: 'View Users', description: 'Can view user list and profiles', category: 'users' },
    { id: 'users.create', name: 'Create Users', description: 'Can create new user accounts', category: 'users' },
    { id: 'users.edit', name: 'Edit Users', description: 'Can modify user details', category: 'users' },
    { id: 'users.delete', name: 'Delete Users', description: 'Can remove user accounts', category: 'users' },
    { id: 'roles.view', name: 'View Roles', description: 'Can view role definitions', category: 'roles' },
    { id: 'roles.create', name: 'Create Roles', description: 'Can create new roles', category: 'roles' },
    { id: 'roles.edit', name: 'Edit Roles', description: 'Can modify role permissions', category: 'roles' },
    { id: 'roles.delete', name: 'Delete Roles', description: 'Can remove roles', category: 'roles' },
    { id: 'content.view', name: 'View Content', description: 'Can view published content', category: 'content' },
    { id: 'content.create', name: 'Create Content', description: 'Can create new content', category: 'content' },
    { id: 'content.edit', name: 'Edit Content', description: 'Can modify existing content', category: 'content' },
    { id: 'content.delete', name: 'Delete Content', description: 'Can remove content', category: 'content' },
    { id: 'content.publish', name: 'Publish Content', description: 'Can publish/unpublish content', category: 'content' },
    { id: 'settings.view', name: 'View Settings', description: 'Can view application settings', category: 'settings' },
    { id: 'settings.edit', name: 'Edit Settings', description: 'Can modify application settings', category: 'settings' },
    { id: 'reports.view', name: 'View Reports', description: 'Can view analytics and reports', category: 'reports' },
    { id: 'reports.export', name: 'Export Reports', description: 'Can export report data', category: 'reports' },
  ];

  matrix: PermissionMatrix = {
    super_admin: this.permissions.reduce((acc, p) => ({ ...acc, [p.id]: true }), {}),
    admin: {
      'users.view': true, 'users.create': true, 'users.edit': true, 'users.delete': true,
      'roles.view': true, 'roles.create': true, 'roles.edit': true, 'roles.delete': false,
      'content.view': true, 'content.create': true, 'content.edit': true, 'content.delete': true, 'content.publish': true,
      'settings.view': true, 'settings.edit': true,
      'reports.view': true, 'reports.export': true,
    },
    manager: {
      'users.view': true, 'users.create': false, 'users.edit': true, 'users.delete': false,
      'roles.view': true, 'roles.create': false, 'roles.edit': false, 'roles.delete': false,
      'content.view': true, 'content.create': true, 'content.edit': true, 'content.delete': false, 'content.publish': true,
      'settings.view': true, 'settings.edit': false,
      'reports.view': true, 'reports.export': true,
    },
    editor: {
      'users.view': false, 'users.create': false, 'users.edit': false, 'users.delete': false,
      'roles.view': false, 'roles.create': false, 'roles.edit': false, 'roles.delete': false,
      'content.view': true, 'content.create': true, 'content.edit': true, 'content.delete': false, 'content.publish': false,
      'settings.view': false, 'settings.edit': false,
      'reports.view': true, 'reports.export': false,
    },
    viewer: {
      'users.view': false, 'users.create': false, 'users.edit': false, 'users.delete': false,
      'roles.view': false, 'roles.create': false, 'roles.edit': false, 'roles.delete': false,
      'content.view': true, 'content.create': false, 'content.edit': false, 'content.delete': false, 'content.publish': false,
      'settings.view': false, 'settings.edit': false,
      'reports.view': true, 'reports.export': false,
    },
  };

  expandedCategories = signal<Set<string>>(new Set(this.categories.map(c => c.key)));

  getPermissionsByCategory(category: string): Permission[] {
    return this.permissions.filter(p => p.category === category);
  }

  togglePermission(roleId: string, permId: string): void {
    if (!this.matrix[roleId]) this.matrix[roleId] = {};
    this.matrix[roleId][permId] = !this.matrix[roleId][permId];
  }

  isGranted(roleId: string, permId: string): boolean {
    return this.matrix[roleId]?.[permId] ?? false;
  }

  toggleCategory(category: string): void {
    this.expandedCategories.update(set => {
      const newSet = new Set(set);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  }

  isCategoryExpanded(category: string): boolean {
    return this.expandedCategories().has(category);
  }

  getCategoryGrantCount(roleId: string, category: string): number {
    return this.getPermissionsByCategory(category).filter(p => this.isGranted(roleId, p.id)).length;
  }

  savePermissions(): void {
    this.saving.set(true);
    setTimeout(() => {
      this.saving.set(false);
      this.toastService.success('Permissions saved', 'Permission matrix has been updated.');
    }, 800);
  }

  createPermission(): void {
    const id = `${this.newPermission.category}.${this.newPermission.name.toLowerCase().replace(/\s+/g, '_')}`;
    this.permissions = [...this.permissions, {
      id,
      name: this.newPermission.name,
      description: this.newPermission.description,
      category: this.newPermission.category,
    }];
    // Initialize in matrix
    for (const roleId of Object.keys(this.matrix)) {
      this.matrix[roleId][id] = false;
    }
    this.newPermission = { name: '', description: '', category: 'users' };
    this.showCreateModal.set(false);
    this.toastService.success('Permission created', 'New permission has been added.');
  }
}
