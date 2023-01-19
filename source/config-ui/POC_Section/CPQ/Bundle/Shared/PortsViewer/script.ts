import { OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  AdjustmentType,
  CfgStatus,
  ChargeItem,
  LineItem,
  PortDomain,
  PriceAdjustment,
  RuntimeAttribute,
} from '@veloceapps/core';
import { ElementDefinition, ScriptHost } from '@veloceapps/sdk/cms';
import {
  ConfigurationService,
  generateLineItem,
  LineItemWorker,
  mapAttributes,
  upsertAttributes,
} from '@veloceapps/sdk/core';
import { Dictionary, flatten, isEmpty } from 'lodash';
import { BehaviorSubject, combineLatest, map, Observable, Subject, takeUntil } from 'rxjs';

type SelectionMode = 'radio' | 'single' | 'multiple';
type CellEditFormat = 'text' | 'number' | 'select' | 'checkbox' | 'date';

interface ScriptContent {
  // inputs
  lineItem$: BehaviorSubject<LineItem | undefined>;
  portsNames$: BehaviorSubject<string[]>;
  hidden$: Observable<boolean>;
  discountsEnabled: Observable<string>;
  approvalsEnabled: Observable<string>;
  approvalMessages: Observable<ApprovalMessage[]>;
  sidebarMode: boolean;
  closeHandler: () => void;
  backHandler: () => void;

  // outputs
  openAttrsSidebar: BehaviorSubject<LineItem>;
  openPortsSidebar: BehaviorSubject<LineItem>;

  // calculated
  tables$: Observable<TableData[]>;

  // handlers
  getCellValue: (data: any, col: ColumnDef) => any;
  onRowSelect: (data: RowData, tableData: TableData) => void;
  onToggleSelectAll: (select: boolean, tableData: TableData) => void;
}

interface TableData {
  rows: RowData[];
  allSelected: boolean;
  selectionMode: SelectionMode;
  selectionDisabled: boolean;
  portDomain: PortDomain;
  cols: ColumnDef[];
}

interface RowData {
  id: string;
  type: string;
  name: string;
  qty: number;
  listPrice: string;
  netPrice: string;
  attributes: Dictionary<any>;
  selected: boolean;
  required: boolean;
  controls: Dictionary<FormControl>;
  model?: LineItem;
}

interface SelectItem<T = any> {
  value?: T;
  label: string;
}

interface ColumnDef {
  field: string;
  headerName: string;
  width?: string;
  class?: string;
  classRules?: (data: RowData) => { [key: string]: boolean };
  valueGetter?: (data: RowData) => any;
  editFormat?: (data: RowData) => CellEditFormat;
  dynamicOptions?: (data: RowData) => string[];
  staticOptions?: SelectItem[];
  onValueChange?: (value: any, data: RowData) => void;
  onClick?: (data: RowData) => void;
  isDisabled?: (data: RowData) => boolean;
  tooltip?: (data: RowData) => string;
  disabledReason?: string;
}

interface ApprovalMessage {
  id: string;
  lineItemId: string;
  reason: string;
}

const DISCOUNT_TYPE_OPTIONS: SelectItem<AdjustmentType | ''>[] = [
  { value: '', label: '' },
  { value: 'MARKUP_PERCENT', label: 'Markup (+%)' },
  { value: 'DISCOUNT_PERCENT', label: 'Discount (-%)' },
  { value: 'MARKUP_AMOUNT', label: 'Markup (+$)' },
  { value: 'DISCOUNT_AMOUNT', label: 'Discount (-$)' },
  { value: 'OVERRIDE_AMOUNT', label: 'Price Override ($)' },
];

const NUMERIC_TYPES = ['INT', 'DOUBLE', 'DECIMAL'];

@ElementDefinition({
  name: 'PortsViewer',
  type: 'CUSTOM',
  isShared: true,
  inputs: {
    discountsEnabled: '/Bundle',
    approvalsEnabled: '/Bundle',
    approvalMessages: '@Shared/MessagesPanel',
  },
  outputs: {
    openAttrsSidebar: '@Shared/AttributesSidebar',
    openPortsSidebar: '@Shared/PortsSidebar',
  },
})
export class Script implements OnInit, OnDestroy {
  private configurationService: ConfigurationService;
  private approvalMessages: ApprovalMessage[] = [];

  private cols: ColumnDef[] = [];
  private pricingEnabled: boolean;

  private destroy$ = new Subject<void>();

  constructor(public host: ScriptHost<ScriptContent>) {
    this.configurationService = this.host.injector.get(ConfigurationService);

    this.pricingEnabled = this.configurationService.contextSnapshot.properties.PricingEnabled === 'true';
    this.host.getCellValue = this.getCellValue;
    this.host.onRowSelect = this.onRowSelect;
    this.host.onToggleSelectAll = this.onToggleSelectAll;
  }

  ngOnInit(): void {
    combineLatest([this.host.discountsEnabled, this.host.approvalsEnabled])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([discountsEnabled, approvalsEnabled]) => {
        this.cols = this.getDefaultColumns(discountsEnabled === 'true', approvalsEnabled === 'true');
      });

    this.host.tables$ = combineLatest([this.host.lineItem$, this.host.portsNames$]).pipe(
      map(([lineItem, portsNames]) => portsNames.map(portName => this.getTableData(lineItem, portName)) ?? []),
      map(tablesData => tablesData.filter(data => !!data) as TableData[]),
    );

    this.host.approvalMessages
      .pipe(takeUntil(this.destroy$))
      .subscribe(approvalMessages => (this.approvalMessages = approvalMessages ?? []));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getTableData(lineItem?: LineItem, portName?: string): TableData | undefined {
    if (!lineItem || !portName) {
      return;
    }

    const portDomain = lineItem.portDomains[portName];
    if (!portDomain) {
      return;
    }

    const cols = [...this.cols, ...this.getAttributesColumns(portDomain.type)];
    const rows = this.getRows(lineItem, portName, portDomain, cols);
    const allSelected = !!rows.length && rows.every(row => row.selected);
    const selectionMode: SelectionMode =
      portDomain.minCard === 1 && portDomain.maxCard === 1
        ? 'radio'
        : portDomain.minCard === 0 && portDomain.maxCard === 1
        ? 'single'
        : 'multiple';
    const selectionDisabled =
      selectionMode === 'multiple' ? !!rows.length && rows.every(row => row.required) : rows.some(row => row.required);

    return {
      rows,
      allSelected,
      selectionMode,
      selectionDisabled,
      portDomain,
      cols,
    };
  }

  private getCellValue(data: RowData, col: ColumnDef): any {
    return col.valueGetter ? col.valueGetter(data) : (data as any)[col.field];
  }

  private getRows(lineItem: LineItem, portName: string, portDomain: PortDomain, cols: ColumnDef[]): RowData[] {
    const products = this.getProducts(lineItem, portDomain, portName);
    const productsInDomain = products.filter(product => portDomain.domainTypes.some(d => d.name === product.typeName));

    const rows = productsInDomain.reduce((acc: RowData[], product) => {
      const selected = lineItem.lineItems.filter(li => li.port === portName && li.type === product.typeName);
      if (!selected.length) {
        return [...acc, this.createRowData(product, portDomain, cols)];
      }

      return [...acc, ...selected.map(li => this.createRowData(product, portDomain, cols, li))];
    }, []);

    return rows;
  }

  private getProducts(lineItem: LineItem, portDomain: PortDomain, portName: string): any[] {
    const runtimeModel = this.configurationService.getRuntimeModel();
    if (!runtimeModel) {
      return [];
    }

    const products = runtimeModel.getProductsByType(portDomain.type);
    if (products.length > 0) {
      return products;
    }

    const domainTypes = lineItem.portDomains[portName]?.domainTypes ?? [];
    return domainTypes.map(type => runtimeModel.components.get(type.name)).filter(c => !!c);
  }

  private createRowData(product: any, portDomain: PortDomain, cols: ColumnDef[], li?: LineItem): RowData {
    const values = li ? mapAttributes(li.attributes) : {};
    const attributes = (product?.attributes ?? []).reduce((acc: any, attr: any) => {
      const { name, ...rest } = attr;
      return name ? { ...acc, [name]: { ...rest, value: values[name] } } : acc;
    }, {} as Dictionary<any>);

    const price = this.getPrices(portDomain, product?.typeName, li);

    const row = {
      id: product?.productId,
      name: product?.productName || product?.typeName,
      qty: 1,
      listPrice: `$${price.list.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      netPrice: `$${price.net.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      type: product?.typeName,
      attributes,
      selected: !!li,
      required: li?.cfgStatus === 'Required',
      model: li,
      controls: {},
    };

    const controls = cols
      .filter(col => col.editFormat && li)
      .reduce((acc, col) => {
        const control = new FormControl(this.getCellValue(row, col));
        if (col.isDisabled?.(row)) {
          control.disable();
        }
        return { ...acc, [col.field]: control };
      }, {} as { [key: string]: FormControl });

    return { ...row, controls };
  }

  private getPrices = (portDomain: PortDomain, type: string, lineItem?: LineItem): { net: number; list: number } => {
    if (lineItem) {
      const mainCharge = this.getMainCharge(lineItem);
      return { net: mainCharge?.netPrice ?? 0, list: mainCharge?.listPrice ?? 0 };
    }

    const domainType = portDomain.domainTypes.find(({ name }) => name === type);
    const [recommendedPrice] = domainType?.recommendedPrices ?? [];

    return { net: recommendedPrice?.netPrice ?? 0, list: recommendedPrice?.listPrice ?? 0 };
  };

  private getDefaultColumns = (discountsEnabled: boolean, approvalsEnabled: boolean): ColumnDef[] => {
    const listPriceColDef: ColumnDef = {
      field: 'listPrice',
      headerName: 'List Price',
      width: '15%',
      class: 'text-right',
    };

    const discountTypeColDef: ColumnDef = {
      field: 'discountType',
      headerName: 'Discount Type',
      width: '15%',
      valueGetter: data => this.getMainCharge(data.model)?.priceAdjustment?.type,
      editFormat: () => 'select',
      staticOptions: DISCOUNT_TYPE_OPTIONS,
      onValueChange: (value, data) => this.priceAdjustmentHandler(data, { type: value || null }),
      isDisabled: data => !this.isPriceAdjustmentEnabled(data.model),
      tooltip: data =>
        this.isPriceAdjustmentEnabled(data.model)
          ? ''
          : 'To enable Discount Types, turn on the Enable Price Adjustment option for the Price List.',
    };

    const discountColDef: ColumnDef = {
      field: 'discount',
      headerName: 'Discount',
      class: 'text-right',
      width: '7%',
      valueGetter: data => this.getMainCharge(data.model)?.priceAdjustment?.amount,
      editFormat: () => 'number',
      onValueChange: (value, data) => this.priceAdjustmentHandler(data, { amount: value }),
      isDisabled: data => !this.isPriceAdjustmentEnabled(data.model),
      tooltip: data =>
        this.isPriceAdjustmentEnabled(data.model)
          ? ''
          : 'To enable Discounts, turn on the Enable Price Adjustment option for the Price List.',
    };

    const netPriceColDef: ColumnDef = { field: 'netPrice', headerName: 'Net Price', width: '15%', class: 'text-right' };

    return [
      ...(approvalsEnabled
        ? [
            {
              field: 'status',
              headerName: '',
              width: '28px',
              classRules: data => ({
                status: !!data.model,
                warning: this.approvalMessages.some(message => message.lineItemId === data.model?.id),
              }),
              tooltip: data =>
                this.approvalMessages
                  .filter(message => message.lineItemId === data.model?.id)
                  .map(message => `&#8226; ${message.reason}`)
                  .join('<br/>'),
            } as ColumnDef,
          ]
        : []),

      {
        field: 'name',
        headerName: 'Name',
        classRules: data => ({ clickable: !isEmpty(data.model?.portDomains) }),
        onClick: data => data.model && !isEmpty(data.model?.portDomains) && this.host.openPortsSidebar.next(data.model),
      },
      {
        field: 'qty',
        headerName: 'QTY',
        class: 'text-right',
        width: '10%',
        valueGetter: data => data.model?.qty?.toString() ?? '',
        editFormat: () => 'number',
        onValueChange: this.changeQtyHandler,
      },
      ...(this.pricingEnabled ? [listPriceColDef] : []),
      ...(this.pricingEnabled && discountsEnabled ? [discountTypeColDef, discountColDef] : []),
      ...(this.pricingEnabled ? [netPriceColDef] : []),
    ];
  };

  private getAttributesColumns = (portType: string): ColumnDef[] => {
    const runtimeModel = this.configurationService.getRuntimeModel();
    if (!runtimeModel) {
      return [];
    }

    let products: any[] = runtimeModel.getProductsByType(portType) as any;
    if (!products?.length) {
      products = [runtimeModel.components.get(portType) as any];
    }

    const attributes = flatten(products.map(p => p.attributes as RuntimeAttribute[])).reduce((acc, attr) => {
      if (!acc[attr.name] && attr.properties?.column) {
        return { ...acc, [attr.name]: attr };
      }
      return acc;
    }, {} as { [key: string]: RuntimeAttribute });

    return Object.values(attributes).map(attribute => this.getAttributeColDef(attribute));
  };

  private getAttributeColDef = (attribute: RuntimeAttribute): ColumnDef => {
    const dynamicOptions = (data: RowData): string[] => {
      const attributeDomain = data.model?.attributeDomains?.[attribute.name].map(value => {
        return value?.min ?? value;
      });
      return attributeDomain ?? attribute.domain?.map(value => value) ?? [];
    };

    const editFormat = (data: RowData): CellEditFormat => {
      if (attribute.type === 'BOOLEAN') {
        return 'checkbox';
      }

      if (attribute.type === 'DATE') {
        return 'date';
      }

      const modelDomain = data.model?.attributeDomains[attribute.name];
      const isNumberFormat =
        NUMERIC_TYPES.includes(attribute.type) && modelDomain
          ? modelDomain.some(d => d.min != null && d.min !== d.max)
          : attribute.domain?.some(d => d?.includes('..'));

      return isNumberFormat ? 'number' : attribute.domain ? 'select' : 'text';
    };

    return {
      field: `attr_${attribute.name}`,
      headerName: attribute.properties.column,
      class: NUMERIC_TYPES.includes(attribute.type) ? 'text-right' : '',
      width: '10%',
      valueGetter: data => data.model?.attributes.find(({ name }) => name === attribute.name)?.value ?? '',
      dynamicOptions,
      editFormat,
      onValueChange: (value, data) => this.attributeChangeHandler(value, attribute.name, data),
      isDisabled: data => !(attribute.name in data.attributes) || !!attribute.calculated,
    };
  };

  private isPriceAdjustmentEnabled = (li?: LineItem): boolean => {
    if (!li) {
      return false;
    }
    const mainCharge = this.getMainCharge(li);
    return this.configurationService.chargesSnapshot[mainCharge?.chargeId ?? '']?.enablePriceAdjustment;
  };

  private onToggleSelectAll = (select: boolean, tableData: TableData): void => {
    if (!this.host.lineItem$.value) {
      return;
    }

    const model = this.host.lineItem$.value;

    const alreadyAdded = tableData.rows.filter(row => !!row.model).map(row => row.model?.type) as string[];

    // on select - set cfgStatus to 'User' to all existing lineItems on port
    const lineItems = select
      ? [
          ...model.lineItems.map(li =>
            alreadyAdded.includes(li.type) ? { ...li, cfgStatus: this.getUpdatedCfgStatus(li) } : li,
          ),
          ...tableData.rows
            .filter(({ type }) => !model.lineItems.some(li => li.type === type))
            .map(({ type }) => generateLineItem(tableData.portDomain.name, type, model.id)),
        ]
      : model.lineItems.filter(({ port, cfgStatus }) => port !== tableData.portDomain.name || cfgStatus === 'Required');

    this.configurationService.patch({ ...model, cfgStatus: this.getUpdatedCfgStatus(model), lineItems });
  };

  private onRowSelect = (data: RowData, tableData: TableData): void => {
    if (!this.host.lineItem$.value) {
      return;
    }

    const model = this.host.lineItem$.value;
    const portDomain = tableData.portDomain;

    let lineItems: LineItem[] = [];
    switch (tableData.selectionMode) {
      case 'multiple':
        lineItems = data.model
          ? model.lineItems.filter(({ id }) => id !== data.model?.id)
          : [...model.lineItems, generateLineItem(portDomain.name, data.type, model.id)];
        break;
      case 'radio':
        lineItems = [
          ...model.lineItems.filter(({ port }) => port !== portDomain.name),
          generateLineItem(portDomain.name, data.type, model.id),
        ];
        break;
      case 'single': {
        const filteredLineItems = model.lineItems.filter(({ port }) => port !== portDomain.name);

        lineItems = data.model
          ? filteredLineItems
          : [...filteredLineItems, generateLineItem(portDomain.name, data.type, model.id)];
        break;
      }
    }

    const lineItem: LineItem = {
      ...model,
      cfgStatus: this.getUpdatedCfgStatus(model),
      lineItems,
    };

    this.configurationService.patch(lineItem);
  };

  private changeQtyHandler = (value: any, data: RowData): void => {
    const lineItem = this.host.lineItem$.value;
    const { qty } = data.model ?? {};
    const numeric = Number(value);

    if (!lineItem || !data.model) {
      return;
    }

    if (typeof numeric !== 'number' || value === qty) {
      return;
    }

    const updatedLi = new LineItemWorker({ ...lineItem, cfgStatus: this.getUpdatedCfgStatus(lineItem) }).replace({
      ...data.model,
      cfgStatus: this.getUpdatedCfgStatus(data.model),
      qty: numeric,
    }).li;

    this.configurationService.patch(updatedLi);
  };

  private attributeChangeHandler = (value: any, name: string, data: RowData): void => {
    if (!data.model) {
      return;
    }

    this.configurationService.patch({
      ...data.model,
      cfgStatus: this.getUpdatedCfgStatus(data.model),
      attributes: upsertAttributes(data.model.attributes, [{ name, value }]),
    });
  };

  private priceAdjustmentHandler = (data: RowData, adjustment: Partial<PriceAdjustment>): void => {
    const lineItem = this.host.lineItem$.value;
    if (!lineItem || !data.model) {
      return;
    }

    const charge = this.getMainCharge(data.model);
    if (!charge) {
      return;
    }

    const typeChanged = adjustment.type !== undefined;

    const priceAdjustment: PriceAdjustment | undefined = typeChanged
      ? adjustment.type
        ? {
            amount: charge.priceAdjustment?.amount ?? 0,
            type: adjustment.type,
            explanation: '',
          }
        : undefined
      : {
          amount: adjustment.amount ?? 0,
          type: charge.priceAdjustment?.type ?? 'DISCOUNT_PERCENT',
          explanation: '',
        };

    const updatedProductLi: LineItem = {
      ...data.model,
      cfgStatus: this.getUpdatedCfgStatus(data.model),
      chargeItems: data.model.chargeItems.map(c => {
        if (c.id === charge.id) {
          return { ...charge, priceAdjustment };
        }
        return c;
      }),
    };
    const updatedLi = new LineItemWorker({ ...lineItem, cfgStatus: this.getUpdatedCfgStatus(lineItem) }).replace(
      updatedProductLi,
    ).li;

    this.configurationService.patch(updatedLi);
  };

  private getMainCharge = (lineItem?: LineItem): ChargeItem | undefined => {
    if (!lineItem) {
      return;
    }

    const charges = this.configurationService.chargesSnapshot;

    return lineItem.chargeItems.find(item => !!charges[item.chargeId]?.main);
  };

  private getUpdatedCfgStatus = (li: LineItem): CfgStatus => {
    return li.cfgStatus === 'Required' ? 'Required' : 'User';
  };
}
