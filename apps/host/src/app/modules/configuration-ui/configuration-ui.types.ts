import { Params } from '@angular/router';
import { Dictionary } from 'lodash';

export interface FlowProperties {
  id: string;
  entryPath: string;
  queryParams: Dictionary<string>;
  queryParamsStr: string;
}

export interface DebugSettings {
  flow: FlowProperties;
  objectId: string;
}

export interface ConfigUiCard {
  model: string;
  ui: string;
  link: string;
  queryParams?: Params;
  debugSettings?: DebugSettings;
}
