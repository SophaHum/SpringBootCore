import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { ToastService } from '../../services/toast.service';
import { ApiService } from '../../services/api.service';
import { forkJoin } from 'rxjs';

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
export class PermissionsComponent implements OnInit {
  private toastService = inject(ToastService);
  private apiService = inject(ApiService);

  activeView = signal<'matrix' | 'tree'>('matrix');
  showCreateModal = signal(false);
  saving = signal(false);

  newPermission = { name: '', description: '', category: 'users' };

  rolesData = signal<any[]>([]);
  permissionsData = signal<Permission[]>([]);
  matrix: PermissionMatrix = {};

  categories = [
    { key: 'users', label: 'User Management', icon: 'users' },
    { key: 'roles', label: 'Role Management', icon: 'shield' },
    { key: 'content', label: 'Content', icon: 'file-text' },
    { key: 'settings', label: 'Settings', icon: 'settings' },
    { key: 'reports', label: 'Reports', icon: 'bar-chart' },
  ];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    forkJoin({
      roles: this.apiService.getRoles(),
      permissions: this.apiService.getPermissions()
    }).subscribe({
      next: ({ roles, permissions }) => {
        this.rolesData.set(roles);
        this.permissionsData.set(permissions);
        this.buildMatrix(roles, permissions);
      },
      error: () => this.toastService.error('Error', 'Failed to load permissions data')
    });
  }

  buildMatrix(roles: any[], permissions: Permission[]): void {
    const newMatrix: PermissionMatrix = {};
    roles.forEach(role => {
      newMatrix[role.id] = {};
      permissions.forEach(perm => {
        // Assume role has a permissions collection of objects with id
        newMatrix[role.id][perm.id] = role.permissions?.some((p: any) => p.id === perm.id) || 
                                    role.permissionNames?.includes(perm.id) || false;
      });
    });
    this.matrix = newMatrix;
  }

  expandedCategories = signal<Set<string>>(new Set<string>());

  getPermissionsByCategory(category: string): Permission[] {
    return this.permissionsData().filter(p => p.category === category);
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
    
    // In a real app, you might have a bulk update endpoint.
    // Here we'll update roles one by one for simplicity in this demo.
    const updates = this.rolesData().map(role => {
      const selectedPerms = Object.keys(this.matrix[role.id])
        .filter(permId => this.matrix[role.id][permId])
        .map(id => ({ id })); // Send as partial permission objects
      
      return this.apiService.put(`roles/${role.id}`, {
        ...role,
        permissions: selectedPerms
      });
    });

    forkJoin(updates).subscribe({
      next: () => {
        this.saving.set(false);
        this.toastService.success('Permissions saved', 'Role permission mappings have been updated.');
        this.loadData();
      },
      error: () => {
        this.saving.set(false);
        this.toastService.error('Error', 'Failed to save permissions');
      }
    });
  }

  createPermission(): void {
    this.apiService.post('permissions', this.newPermission).subscribe({
      next: () => {
        this.toastService.success('Permission created', 'New permission has been added.');
        this.loadData();
        this.newPermission = { name: '', description: '', category: 'users' };
        this.showCreateModal.set(false);
      },
      error: () => this.toastService.error('Error', 'Failed to create permission')
    });
  }
}
