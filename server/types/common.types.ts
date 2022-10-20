import { ElementModel, ELEMENT_TYPE } from '@veloce/sdk/cms';
import { Dictionary } from 'lodash';

export interface HttpError {
  status: number;
  message: string;
  body: any;
}

export interface Metadata {
  name: string;
  type: ELEMENT_TYPE;
  children: string[];
  inputs: Dictionary<string>;
  outputs: Dictionary<string>;
  model: ElementModel;
}
