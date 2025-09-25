import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MetricsService } from '../../core/services/metrics.service';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-message-monitoring',
  standalone: true,
  imports: [CommonModule, MatTableModule,MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule],
  templateUrl: './message-monitoring.component.html',
  styleUrls: ['./message-monitoring.component.scss']
})
export class MessageMonitoringComponent {

  transactionForm: FormGroup;
  banks: string[] = ['BankA', 'BankB', 'BankC']; // Example bank list
  fileContent: string | null = null;

  constructor(private fb: FormBuilder, private metricsService: MetricsService) {
    this.transactionForm = this.fb.group({
      transactionId: [''],
      bank: [''],
      message: [''],
    });
  }

  ngOnInit(): void {
    // this.fetchTransactions();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fileContent = e.target.result;
        this.transactionForm.patchValue({ message: this.fileContent });
      };
      reader.readAsText(file);
    }
  }

  
  submitTransaction(): void {
    const payload = this.transactionForm.value;
    this.metricsService.getTransactions(payload).subscribe(
      (data) => {
        console.log('Transaction submitted successfully:', data);
        this.transactionForm.reset();
      },
      (error) => {
        console.error('Error submitting transaction:', error);
      }
    );
  }

  fetchTransactions(): void {
    // Fetch recent transactions if needed
  }
}
