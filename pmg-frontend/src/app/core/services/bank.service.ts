import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BankService {
  constructor(private http: HttpClient) {}

  getBanks(): Observable<any> {
    return this.http.get<any>('https://localhost:3000/api/bank');
  }

  addBank(payload: any): Observable<any> {
    return this.http.post('https://localhost:3000/api/bank', payload);
  }
}
