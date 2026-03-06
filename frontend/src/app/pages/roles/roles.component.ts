import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { ToastService } from '../../services/toast.service';
import { ApiService } from '../../services/api.service';

interface Role {
  id: number;
  name: string;
  description: string;
  usersCount: number;
  permissionNames: string[];
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
export class RolesComponent implements OnInit {
  private toastService = inject(ToastService);
  private apiService = inject(ApiService);

  searchQuery = signal('');
  sortKey = signal('name');
  sortDir = signal<'asc' | 'desc'>('asc');
  showCreateModal = signal(false);
  showDeleteModal = signal(false);
  selectedRole = signal<Role | null>(null);

  newRole = { name: '', description: '', color: '#6366f1' };

  roles = signal<Role[]>([]);

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.apiService.getRoles().subscribe({
      next: (data: any[]) => this.roles.set(data),
      error: () => this.toastService.error('Error', 'Failed to load roles')
    });
  }

  get filteredRoles(): Role[] {
    let result = [...this.roles()];
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
      const updatedRole = {
        ...role,
        name: role.editName,
        description: role.editDescription
      };
      this.apiService.put(`roles/${role.id}`, updatedRole).subscribe({
        next: () => {
          this.toastService.success('Role updated', `${updatedRole.name} has been saved.`);
          this.loadRoles();
        },
        error: () => this.toastService.error('Error', 'Failed to update role')
      });
    }
  }

  confirmDelete(role: Role): void {
    this.selectedRole.set(role);
    this.showDeleteModal.set(true);
  }

  deleteRole(): void {
    const role = this.selectedRole();
    if (role) {
      this.apiService.delete(`roles/${role.id}`).subscribe({
        next: () => {
          this.toastService.success('Role deleted', `${role.name} has been removed.`);
          this.loadRoles();
          this.showDeleteModal.set(false);
        },
        error: () => this.toastService.error('Error', 'Failed to delete role')
      });
    }
  }

  createRole(): void {
    this.apiService.post('roles', this.newRole).subscribe({
      next: () => {
        this.toastService.success('Role created', 'New role has been added.');
        this.loadRoles();
        this.newRole = { name: '', description: '', color: '#6366f1' };
        this.showCreateModal.set(false);
      },
      error: () => this.toastService.error('Error', 'Failed to create role')
    });
  }
}
