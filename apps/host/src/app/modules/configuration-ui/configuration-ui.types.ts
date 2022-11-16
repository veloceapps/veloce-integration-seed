import { Params } from '@angular/router';
import { Dictionary } from 'lodash';

export type DebugObjectName = 'Account' | 'Quote' | 'Order';

export interface FlowProperties {
  id: string;
  entryPath: string;
  queryParams: Dictionary<string>;
  queryParamsStr: string;
}

export interface DebugSettings {
  flow: FlowProperties;
  objectId: string;
  objectName: DebugObjectName;
}

export interface ConfigUiCard {
  model: string;
  ui: string;
  link: string;
  queryParams?: Params;
  debugSettings?: DebugSettings;
}
