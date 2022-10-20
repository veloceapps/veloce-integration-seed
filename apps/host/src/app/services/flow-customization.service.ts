import { Injectable } from '@angular/core';
import { SalesforceApiService } from '@veloce/api';
import {
  Expression,
  Operator,
  Predicate,
  TemplateComponentWithAttachments,
  UIDefinition as LegacyUIDefinition,
  UITemplateType,
} from '@veloce/core';
import { FlowCustomization } from '@veloce/sdk';
import { UIDefinition } from '@veloce/sdk/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { TemplateComponentMeta } from '../types/templates.types';
import { isLegacyDefinition } from '../utils/ui.utils';
import { ModelsApiService } from './models.service';
import { TemplatesApiService } from './templates.service';

@Injectable({ providedIn: 'root' })
export class CustomizationService implements FlowCustomization {
  constructor(
    private modelsService: ModelsApiService,
    private sfApiService: SalesforceApiService,
    private templatesApiService: TemplatesApiService,
  ) {}

  private getModelNameByProductId(productId: string): Observable<string | undefined> {
    const expression = new Expression(Predicate.AND, [{ operator: Operator.EQ, value: productId, key: 'Id' }]);
    return this.sfApiService
      .query<any>(
        {
          count: 1,
          fields: ['Id', 'Name', 'VELOCPQ__ModelId__r.Name'],
          searchCriteria: { expression },
        },
        'product2',
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
      catchError(() => of(null)),
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
      catchError(() => of(null)),
    );
  }

  getShoppingCartComponent?(templateName: string): Observable<TemplateComponentWithAttachments | null> {
    return this.templatesApiService.fetchTemplates().pipe(
      switchMap(templates => {
        const shoppingCartTemplate = templates.find(
          template => template.type === UITemplateType.SHOPPING_CART && template.name === templateName,
        );

        if (shoppingCartTemplate) {
          return this.templatesApiService.fetchTemplateComponents(shoppingCartTemplate.name);
        } else {
          return of(null);
        }
      }),
      map(components => {
        if (!components?.length) {
          return null;
        }

        const component = components[0] as TemplateComponentMeta;

        return {
          id: '',
          uiTemplateId: '',
          type: component.type,
          name: component.name,
          html: component.template,
          js: component.script,
          css: component.styles,
          json: component.properties,
        };
      }),
    );
  }

  getCatalogComponent?(templateName: string): Observable<TemplateComponentWithAttachments | null> {
    return this.templatesApiService.fetchTemplates().pipe(
      switchMap(templates => {
        const catalogTemplate = templates.find(
          template => template.type === UITemplateType.CATALOG && template.name === templateName,
        );

        if (catalogTemplate) {
          return this.templatesApiService.fetchTemplateComponents(catalogTemplate.name);
        } else {
          return of(null);
        }
      }),
      map(components => {
        if (!components?.length) {
          return null;
        }

        const component = components[0] as TemplateComponentMeta;

        return {
          id: '',
          uiTemplateId: '',
          type: component.type,
          name: component.name,
          html: component.template,
          js: component.script,
          css: component.styles,
          json: component.properties,
        };
      }),
    );
  }
}
