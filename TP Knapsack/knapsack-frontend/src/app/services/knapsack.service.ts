import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { KnapsackRequest, KnapsackResponse } from '../models/knapsack.model';

@Injectable({
  providedIn: 'root'
})
export class KnapsackService {
  private apiUrl = 'http://localhost:8080/api/solve';

  constructor(private http: HttpClient) {}

  solveKnapsack(request: KnapsackRequest): Observable<KnapsackResponse> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    // Log the request for debugging
    console.log('Sending request to:', this.apiUrl);
    console.log('Request payload:', request);

    return this.http.post<KnapsackResponse>(this.apiUrl, request, { headers })
      .pipe(
        catchError(error => {
          console.error('API Error:', error);
          throw error;
        })
      );
  }
}
