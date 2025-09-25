import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MetricsService } from '../../core/services/metrics.service';
import { BankService } from '../../core/services/bank.service';
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from '@angular/material/table';
@Component({
  selector: 'app-bank-setup',
  standalone: true,
  imports: [CommonModule, MatInputModule,ReactiveFormsModule,MatTableModule],
  templateUrl: './bank-setup.component.html',
  styleUrls: ['./bank-setup.component.scss'],
})
export class BankSetupComponent implements OnInit {
  bankForm: FormGroup;
  banks: any[] = [];

  constructor(private fb: FormBuilder, private metricsService: MetricsService, private bankService: BankService) {
    this.bankForm = this.fb.group({
      name: [''],
      inputFolder: [''],
      outputFolder: [''],
    });
  }

  ngOnInit(): void {
    this.fetchBanks();
  }

  fetchBanks(): void {
    this.bankService.getBanks().subscribe(
      (data) => {
        this.banks = data;
      },
      (error) => {
        console.error('Error fetching banks:', error);
      }
    );
  }

  submitBank(): void {
    const payload = this.bankForm.value;
    this.bankService.addBank(payload).subscribe(
      (data) => {
        console.log('Bank added successfully:', data);
        this.fetchBanks(); // Refresh the bank list
        this.bankForm.reset();
      },
      (error) => {
        console.error('Error adding bank:', error);
      }
    );
  }
}
