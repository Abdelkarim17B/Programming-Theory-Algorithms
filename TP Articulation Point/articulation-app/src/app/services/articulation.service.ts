import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Graph {
  vertices: number;
  edges: number[][];
}

interface Response {
  articulation_points: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ArticulationService {
  private apiUrl = 'http://localhost:8080/articulation-points';

  constructor(private http: HttpClient) {}

  getArticulationPoints(graph: Graph): Observable<Response> {
    console.log("Sending request to backend with graph:", graph); 
    return this.http.post<Response>(this.apiUrl, graph);
  }
}
