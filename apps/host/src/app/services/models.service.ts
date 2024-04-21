import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SalesforceApiService } from '@veloceapps/api';
import { UIDefinitionContainer } from '@veloceapps/core';
import { combineLatest, map, Observable, withLatestFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ModelsApiService {
  private readonly SERVICE_URL = `${environment.apiServerUrl}/models`;

  constructor(private http: HttpClient, private sfApiService: SalesforceApiService) {}

  public fetchModelsNames(): Observable<string[]> {
    return this.http.get<string[]>(this.SERVICE_URL);
  }

  public fetchAvailableModelDefinitions(model: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.SERVICE_URL}/${model}`);
  }

  public fetchModelDefinitions(model: string): Observable<UIDefinitionContainer[]> {
    return this.http.get<UIDefinitionContainer[]>(`${this.SERVICE_URL}/${model}/definitions`).pipe(
      withLatestFrom(this.getProductModelId(model)),
      map(([uiDefinitionContainers, modelId]) =>
        uiDefinitionContainers.map(uiDefinitionContainer => ({
          ...uiDefinitionContainer,
          modelId: modelId ?? '',
        })),
      ),
    );
  }

  public fetchModelDefinition(model: string, name: string): Observable<UIDefinitionContainer> {
    return combineLatest([
      this.http.get<UIDefinitionContainer>(`${this.SERVICE_URL}/${model}/${name}`),
      this.getProductModelId(model),
    ]).pipe(map(([uiDefinitionContainer, modelId]) => ({ ...uiDefinitionContainer, modelId: modelId ?? '' })));
  }

  private getProductModelId(modelName: string): Observable<string | undefined> {
    return this.sfApiService
      .query<{
        Id: string;
      }>({ rawCondition: `Name = '${modelName}'`, fields: ['Id'] }, 'VELOCPQ__ProductModel__c')
      .pipe(map(results => results[0]?.Id));
  }
}
