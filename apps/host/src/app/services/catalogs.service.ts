import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UIDefinition } from '@veloce/sdk/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CatalogsApiService {
  private readonly SERVICE_URL = `${environment.apiServerUrl}/catalogs`;

  constructor(private http: HttpClient) {}

  public fetchCatalogsNames(): Observable<string[]> {
    return this.http.get<string[]>(this.SERVICE_URL);
  }

  public fetchAvailableCatalogDefinitions(catalog: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.SERVICE_URL}/${catalog}`);
  }

  public fetchCatalogDefinitions(catalog: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.SERVICE_URL}/${catalog}/definitions`);
  }

  public fetchDefinition(catalog: string, name: string): Observable<UIDefinition> {
    return this.http.get<UIDefinition>(`${this.SERVICE_URL}/${catalog}/${name}`);
  }
}
