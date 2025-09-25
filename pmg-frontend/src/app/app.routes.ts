

import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { UserManagementComponent } from './modules/user-management/user-management.component';
import { BankSetupComponent } from './modules/bank-setup/bank-setup.component';
import { MessageMonitoringComponent } from './modules/message-monitoring/message-monitoring.component';
import { ComplianceComponent } from './modules/compliance/compliance.component';
import { ReportsComponent } from './modules/reports/reports.component';
import { AdminComponent } from './modules/admin/admin.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'user-management', component: UserManagementComponent },
      { path: 'bank-setup', component: BankSetupComponent },
      { path: 'message-monitoring', component: MessageMonitoringComponent },
      { path: 'compliance', component: ComplianceComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'admin', component: AdminComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: 'dashboard' }
    ]
  }
];
