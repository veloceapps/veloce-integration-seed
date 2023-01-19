import { OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Attribute, LineItem, RuntimeAttribute, RuntimeModel } from '@veloceapps/core';
import { ElementDefinition, ScriptHost } from '@veloceapps/sdk/cms';
import { ConfigurationService, findLineItem, LineItemWorker } from '@veloceapps/sdk/core';
import { BehaviorSubject, filter, map, Observable, shareReplay, Subject, takeUntil, tap } from 'rxjs';

interface ScriptContent {
  lineItem$: BehaviorSubject<LineItem | undefined>;
  isOpened$: Observable<boolean>;

  openAttrsSidebar: Observable<LineItem | undefined>;
  attributesForm$: Observable<FormGroup>;
  attributes$: Observable<AttributeData[] | undefined>;
  saveHandler: (form: FormGroup) => void;
  discardHandler: () => void;
  closeHandler: () => void;
}

interface AttributeData {
  name: string;
  type: 'boolean' | 'text' | 'number' | 'select' | 'date';
  value: any;
  readonly: boolean;
  options?: string[];
}

@ElementDefinition({
  name: 'AttributesSidebar',
  type: 'CUSTOM',
  module: 'Shared',
  children: [],
  inputs: {
    openAttrsSidebar: null,
  },
})
export class Script implements OnInit, OnDestroy {
  configurationService: ConfigurationService;
  runtimeModel?: RuntimeModel;

  destroy$ = new Subject<void>();

  constructor(public host: ScriptHost<ScriptContent>) {
    this.configurationService = this.host.injector.get(ConfigurationService);
    this.runtimeModel = this.configurationService.getRuntimeModel();

    this.host.lineItem$ = new BehaviorSubject<LineItem | undefined>(undefined);
    this.host.isOpened$ = this.host.lineItem$.pipe(map(lineItem => !!lineItem));
    this.host.saveHandler = this.saveHandler;
    this.host.discardHandler = this.discardHandler;
    this.host.closeHandler = this.closeHandler;
  }

  ngOnInit(): void {
    this.host.openAttrsSidebar
      .pipe(
        takeUntil(this.destroy$),
        tap(model => this.host.lineItem$.next(model)),
      )
      .subscribe();

    this.host.attributes$ = this.host.lineItem$.pipe(
      map(model => {
        const component = model && this.runtimeModel?.components.get(model.type);
        const tableAttributesNames = [
          ...new Set(component?.attributes.filter(attr => attr.properties?.column).map(attr => attr.name)),
        ];
        return model
          ? model.attributes
              .filter(attribute => !tableAttributesNames.includes(attribute.name))
              .map(attribute => {
                const runtimeAttribute = component?.attributes.find(a => a.name === attribute.name);
                return this.getAttributeData(attribute, model, runtimeAttribute);
              })
          : undefined;
      }),
      map(attributes => attributes?.filter(({ name }) => !name.startsWith('_'))),
      shareReplay(),
    );

    this.host.attributesForm$ = this.host.attributes$.pipe(
      map(attributes => {
        const controls = attributes?.reduce((acc, attribute) => {
          const control = new FormControl(attribute.value);
          if (attribute.readonly) {
            control.disable();
          }

          return { ...acc, [attribute.name]: control };
        }, {});

        return new FormGroup(controls ?? {});
      }),
    );

    // update attrs sidebar data on model update
    this.configurationService
      .get()
      .pipe(
        takeUntil(this.destroy$),
        map(m => m && this.host.lineItem$.value && findLineItem(this.host.lineItem$.value.id, [m])),
        filter(model => !!model),
        tap(model => this.host.lineItem$.next(model)),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private closeHandler = () => {
    this.host.lineItem$.next(undefined);
  };

  private saveHandler = (form: FormGroup): void => {
    if (!this.host.lineItem$.value) {
      return;
    }

    const attributes = Object.entries(form.value).map(([name, value]) => ({ name, value }));
    const updated = new LineItemWorker(this.host.lineItem$.value).patchAttribute(attributes).li;

    this.configurationService.patch(updated);
  };

  private discardHandler = (): void => {
    const model = this.host.lineItem$.value;
    this.host.lineItem$.next(model && { ...model });
  };

  private getAttributeData = (
    modelAttribute: Attribute,
    model: LineItem,
    runtimeAttribute?: RuntimeAttribute,
  ): AttributeData => {
    const domain = model.attributeDomains[modelAttribute.name];
    const domainOptions = domain?.map(value => value?.min ?? value);
    const options = domainOptions ?? runtimeAttribute?.domain?.map(value => value);

    const isNumberFormat =
      ['INT', 'DOUBLE', 'DECIMAL'].includes(modelAttribute.type) && domain
        ? domain.some(d => d.min != null && d.min !== d.max)
        : runtimeAttribute?.domain?.some(d => d?.includes('..')) && modelAttribute.type !== 'DATE';

    let type: AttributeData['type'];
    if (modelAttribute.type === 'BOOLEAN') {
      type = 'boolean';
    } else if (modelAttribute.type === 'DATE') {
      type = 'date';
    } else if (isNumberFormat) {
      type = 'number';
    } else if (!!options?.length) {
      type = 'select';
    } else {
      type = 'text';
    }

    return {
      name: modelAttribute.name,
      type,
      value: modelAttribute.value,
      options,
      readonly: runtimeAttribute?.calculated ?? false,
    };
  };
}
