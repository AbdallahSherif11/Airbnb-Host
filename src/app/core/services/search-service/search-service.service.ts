import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FilterResult } from '../../interfaces/SearchFilter/filter-result';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'https://myairbnb.runasp.net/api/Search';

  constructor(private http: HttpClient) { }

  smartSearchNaturalLanguage(prompt: string): Observable<any> {
    return this.http.post<FilterResult>(`${this.apiUrl}/smart-search-nl`, `"${prompt}"`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}