import { Injectable } from '@angular/core';
import { SalesforceApiService } from '@veloce/api';
import { Expression, Operator, Predicate, UIDefinition as LegacyUIDefinition } from '@veloce/core';
import { FlowCustomization } from '@veloce/sdk';
import { UIDefinition } from '@veloce/sdk/cms';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { isLegacyDefinition } from '../utils/ui.utils';
import { ModelsApiService } from './models.service';

@Injectable({ providedIn: 'root' })
export class CustomizationService implements FlowCustomization {
  constructor(private modelsService: ModelsApiService, private sfApiService: SalesforceApiService) {}

  private getModelNameByProductId(productId: string): Observable<string | undefined> {
    const expression = new Expression(Predicate.AND, [{ operator: Operator.EQ, value: productId, key: 'Id' }]);
    return this.sfApiService
      .query<any>(
        {
          count: 1,
          fields: ['Id', 'Name', 'VELOCPQ__ModelId__r.Name'],
          searchCriteria: { expression }
        },
        'product2'
      )
      .pipe(map(response => response?.[0]?.VELOCPQ__ModelId__r?.Name));
  }

  getUiDefinition(productId: string): Observable<UIDefinition | null> {
    return this.getModelNameByProductId(productId).pipe(
      switchMap(modelName => {
        if (!modelName) {
          throw '';
        }

        return this.modelsService.fetchModelDefinitions(modelName);
      }),
      map(uiDefs => {
        const nonLegacyUiDefs = uiDefs.filter((uiDef): uiDef is UIDefinition => !isLegacyDefinition(uiDef));
        return nonLegacyUiDefs.find(uiDef => uiDef.primary) ?? nonLegacyUiDefs[0] ?? null;
      }),
      catchError(() => of(null))
    );
  }

  getLegacyUiDefinition(productId: string): Observable<LegacyUIDefinition | null> {
    return this.getModelNameByProductId(productId).pipe(
      switchMap(modelName => {
        if (!modelName) {
          throw '';
        }

        return this.modelsService.fetchModelDefinitions(modelName);
      }),
      map(uiDefs => {
        const legacyUiDefs = uiDefs.filter(isLegacyDefinition);
        return legacyUiDefs.find(uiDef => uiDef.primary) ?? legacyUiDefs[0] ?? null;
      }),
      catchError(() => of(null))
    );
  }
}
