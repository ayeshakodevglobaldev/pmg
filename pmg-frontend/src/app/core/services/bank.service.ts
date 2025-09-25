import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BankService {
  constructor(private http: HttpClient) {}

  getBanks(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/banks');
  }

  addBank(payload: any): Observable<any> {
    return this.http.post('http://localhost:3000/banks', payload);
  }
}
