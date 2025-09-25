import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MetricsService } from '../../core/services/metrics.service';
import { parseMetrics } from '../../core/utlis/metrics-parser';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule,MatProgressSpinnerModule,
    MatListModule,],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  metrics: any = {};
  loading = true;
  transactions: any[] = [];
  loadingTransactions = true;
  
  constructor(private metricsService: MetricsService) {}

  ngOnInit(): void {
    this.fetchMetrics();
    this.fetchTransactions();
  }

  fetchMetrics(): void {
    this.metricsService.getMetrics().subscribe(
      (data) => {
        this.metrics = parseMetrics(data);
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching metrics:', error);
        this.loading = false;
      }
    );
  }

  fetchTransactions(): void {
    const payload = { filter: 'recent' }; // Example payload
    this.metricsService.getTransactions(payload).subscribe(
      (data) => {
        this.transactions.push(data); // Add the transaction to the list
        this.loadingTransactions = false;
      },
      (error) => {
        console.error('Error fetching transactions:', error);
        this.loadingTransactions = false;
      }
    );
  }
}
