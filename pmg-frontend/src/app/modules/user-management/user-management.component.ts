import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent {
  displayedColumns = ['name', 'role', 'status', 'actions'];
  users: User[] = [
    { name: 'Ayesha Khan', role: 'Admin', status: 'Active' },
    { name: 'Ali Raza', role: 'Operator', status: 'Active' },
    { name: 'Sara Malik', role: 'Compliance', status: 'Inactive' },
    { name: 'Bilal Ahmed', role: 'Viewer', status: 'Active' }
  ];
}
