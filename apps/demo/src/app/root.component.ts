import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { QuoteApiService } from '@veloce/api';
import { LineItem } from '@veloce/core';
import { generateLineItem, LineItemWorker } from '@veloce/sdk/cms';
import { map, Observable, of, switchMap } from 'rxjs';
import { ConfigurationService } from './services/configuration.service';
import { HostContext } from './types/host.types';

interface Product {
  typeName: string;
  parent?: Product;
}

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class RootComponent implements OnInit {
  public products$: Observable<LineItem[]> = of([]);
  public phones: Product[] = [];

  private quoteApiService!: QuoteApiService;

  @Input()
  set data(data: HostContext) {
    this.configurationService.init(data.configurationService);
    this.quoteApiService = data.quoteApiService;
  }

  constructor(private configurationService: ConfigurationService) {}

  ngOnInit() {
    this.products$ = this.configurationService.getLineItem$().pipe(map(lineItem => lineItem?.lineItems ?? []));

    this.phones = this.getPhones();
  }

  addPhoneClickHandler(typeName: string) {
    const rootLineItem = this.configurationService.getLineItemSnapshot();
    if (!rootLineItem) {
      return;
    }

    const phoneLineItem = generateLineItem('phones', typeName, rootLineItem.id);
    const patched = new LineItemWorker(rootLineItem).insert(rootLineItem.id, phoneLineItem).li;
    this.configurationService.patch$(patched).subscribe();
  }

  public trackByFn(_: number, phone: LineItem): string {
    return phone.id;
  }

  private getPhones(): Product[] {
    const runtimeModel = this.configurationService.getRuntimeModel();
    if (!runtimeModel) {
      return [];
    }

    return Array.from(runtimeModel.components.values()).filter(product => product.parent?.typeName === 'Phone');
  }

  public saveHandler = (): void => {
    const context = this.configurationService.getRuntimeContext();
    const quoteId = context?.properties?.Id;

    if (!context || !quoteId || context.runtimeMode === 0) {
      alert('TEST MODE: Save');
      return;
    }

    const rootLineItem = this.configurationService.getLineItemSnapshot();
    const currentState = rootLineItem ? [rootLineItem] : [];

    this.quoteApiService
      .getQuoteDraft(quoteId)
      .pipe(switchMap(quoteDraft => this.quoteApiService.upsertQuote({ ...quoteDraft, currentState })))
      .subscribe();
  };
}
