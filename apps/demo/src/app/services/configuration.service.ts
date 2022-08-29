import { Injectable } from '@angular/core';
import { LineItem, RuntimeModel } from '@veloce/core';
import { ConfigurationService as VeloceConfigurationService, RuntimeContext } from '@veloce/sdk/cms';
import { Observable } from 'rxjs';

@Injectable()
export class ConfigurationService {
  private vlCfgService!: VeloceConfigurationService;

  public init(vlCfgService: VeloceConfigurationService) {
    this.vlCfgService = vlCfgService;
  }

  public getLineItem$(): Observable<LineItem | undefined> {
    return this.vlCfgService.get();
  }

  public getLineItemSnapshot(): LineItem | undefined {
    return this.vlCfgService.getSnapshot();
  }

  public patch$(lineItem: LineItem): Observable<LineItem> {
    return this.vlCfgService.patch$(lineItem);
  }

  public getRuntimeModel(): RuntimeModel | undefined {
    return this.vlCfgService.getRuntimeModel();
  }

  public getRuntimeContext(): RuntimeContext | undefined {
    return this.vlCfgService.getRuntimeContext();
  }
}
