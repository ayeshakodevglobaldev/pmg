import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ComplianceService {
  constructor(private http: HttpClient) {}
  // Add compliance-related API methods here
}
