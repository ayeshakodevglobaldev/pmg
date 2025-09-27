import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { BankService } from '../../core/services/bank.service';
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from "@angular/material/select";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-bank-setup',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule,MatButtonModule, ReactiveFormsModule, MatTableModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatSelectModule, MatCardModule, MatIconModule],
  templateUrl: './bank-setup.component.html',
  styleUrls: ['./bank-setup.component.scss'],
})
export class BankSetupComponent implements OnInit {
  bankForm: FormGroup;

  constructor(private fb: FormBuilder, private bankService: BankService) {
    // Initialize the form structure
    this.bankForm = this.fb.group({
      bankName: ['', Validators.required],
      bankId: ['', Validators.required],
      certificate: [null], // Optional certificate upload
      channels: this.fb.array([]), // Dynamic form array for channels
      logs: this.fb.group({
        logPath: ['', Validators.required],
        reportPath: ['', Validators.required],
        retention: ['30', Validators.required], // Default retention: 30 days
      }),
    });
  }

  ngOnInit(): void {
    this.fetchBank();
  }

  // Getter for channels form array
  get channels(): FormArray {
    return this.bankForm.get('channels') as FormArray;
  }

  // Add a new channel to the form array
  addChannel(): void {
    this.channels.push(
      this.fb.group({
        name: ['', Validators.required], // Channel name (e.g., MT, MX, etc.)
        enabled: [true], // Enable/disable toggle
        inputPath: ['', Validators.required], // Input folder path
        outputPath: ['', Validators.required], // Output folder path or API URL
        format: ['MT', Validators.required], // File format (dropdown: MT, MX, XML, JSON)
        credentials: this.fb.group({
          username: [''], // Optional username
          password: [''], // Optional password
          certificate: [null], // Optional certificate upload
        }),
      })
    );
  }

  // Remove a channel from the form array
  removeChannel(index: number): void {
    this.channels.removeAt(index);
  }

  // Fetch bank configuration from the backend
  fetchBank(): void {
    this.bankService.getBanks().subscribe(
      (data) => {
        if (data.logs) {
          // Populate basic bank info
          this.bankForm.patchValue({
            bankName: data.bankName,
            bankId: data.bankId,
            logs: {
              logPath: data.logs.logPath,
              reportPath: data.logs.reportPath,
              retention: data.logs.retention,
            },
          });

          // Populate channels
          data.channels.forEach((channel: any) => {
            this.channels.push(
              this.fb.group({
                name: [channel.name],
                enabled: [channel.enabled],
                inputPath: [channel.inputPath],
                outputPath: [channel.outputPath],
                format: [channel.format],
                credentials: this.fb.group({
                  username: [channel.credentials?.username || ''],
                  password: [channel.credentials?.password || ''],
                  certificate: [channel.credentials?.certificate || null],
                }),
              })
            );
          });
        }
      },
      (error) => {
        console.error('Error fetching bank configuration:', error);
      }
    );
  }

  // Submit the bank configuration to the backend
  submitBank(): void {
    const payload = this.bankForm.value;

    // Send the form data to the backend
    this.bankService.addBank(payload).subscribe(
      (data) => {
        console.log('Bank configuration updated successfully:', data);
      },
      (error) => {
        console.error('Error updating bank configuration:', error);
      }
    );
  }

  // Reset the form to default values
  resetForm(): void {
    this.bankForm.reset({
      bankName: '',
      bankId: '',
      certificate: null,
      logs: {
        logPath: '',
        reportPath: '',
        retention: '30',
      },
    });
    this.channels.clear(); // Clear all channels
  }

  onCertificateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      this.bankForm.get('certificate')?.setValue(input.files[0]);
    }
  }
}
