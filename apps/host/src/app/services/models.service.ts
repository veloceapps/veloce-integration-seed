import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UIDef } from '../types/ui.types';

@Injectable({ providedIn: 'root' })
export class ModelsApiService {
  private readonly SERVICE_URL = `${environment.apiServerUrl}/models`;

  constructor(private http: HttpClient) {}

  public fetchModelsNames(): Observable<string[]> {
    return this.http.get<string[]>(this.SERVICE_URL);
  }

  public fetchAvailableModelDefinitions(model: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.SERVICE_URL}/${model}`);
  }

  public fetchModelDefinitions(model: string): Observable<UIDef[]> {
    return this.http.get<UIDef[]>(`${this.SERVICE_URL}/${model}/definitions`);
  }

  public fetchModelDefinition(model: string, name: string): Observable<UIDef> {
    return this.http.get<UIDef>(`${this.SERVICE_URL}/${model}/${name}`);
  }
}
