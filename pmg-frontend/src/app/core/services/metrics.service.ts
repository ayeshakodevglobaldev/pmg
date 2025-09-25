import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MetricsService {
  private metricsUrl = 'https://localhost:3000/metrics'; // Replace with your backend URL
  private transactionsUrl = 'http://localhost:3001/transactions';
  constructor(private http: HttpClient) {}

  // Fetch raw metrics data
  getMetrics(): Observable<string> {
    return this.http.get(this.metricsUrl, { responseType: 'text' });
  }
  getTransactions(payload: any): Observable<any> {
    return this.http.post(this.transactionsUrl, payload);
  }
}
