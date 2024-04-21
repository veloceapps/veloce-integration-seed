import { Injectable } from '@angular/core';
import { SalesforceApiService } from '@veloceapps/api';
import {
  ConfigurationProcessor,
  Expression,
  Operator,
  Predicate,
  TemplateComponentWithAttachments,
  UIDefinitionContainer,
  UITemplate,
} from '@veloceapps/core';
import { FlowCustomization } from '@veloceapps/sdk/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { ModelsApiService } from './models.service';
import { TemplatesApiService } from './templates.service';

@Injectable({ providedIn: 'root' })
export class CustomizationService implements FlowCustomization {
  constructor(
    private modelsService: ModelsApiService,
    private sfApiService: SalesforceApiService,
    private templatesApiService: TemplatesApiService,
  ) {}

  public getUiDefinition(productId: string): Observable<UIDefinitionContainer | null> {
    return this.getModelNameByProductId(productId).pipe(
      switchMap(modelName => {
        if (!modelName) {
          throw '';
        }

        return this.modelsService.fetchModelDefinitions(modelName);
      }),
      map(containers => containers.find(container => container.source.primary) ?? containers[0] ?? null),
      catchError(() => of(null)),
    );
  }

  public getTemplates(): Observable<UITemplate[]> {
    return this.templatesApiService.fetchTemplates();
  }

  public getTemplateComponents(templateName: string): Observable<TemplateComponentWithAttachments[] | null> {
    return this.templatesApiService.fetchTemplates().pipe(
      switchMap(templates => {
        const assetsTemplate = templates.find(template => template.name === templateName);

        if (assetsTemplate) {
          return this.templatesApiService.fetchTemplateComponents(assetsTemplate.name);
        } else {
          return of(null);
        }
      }),
      map(components => {
        if (!components?.length) {
          return null;
        }

        return components.map(component => ({
          id: '',
          uiTemplateId: '',
          type: component.type,
          name: component.name,
          html: component.template,
          js: component.script,
          css: component.styles,
          json: component.properties,
        }));
      }),
    );
  }

  public getTemplateConfigurationProcessors(templateName: string): Observable<ConfigurationProcessor[] | null> {
    return this.templatesApiService.fetchConfigurationProcessors(templateName);
  }

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
}
