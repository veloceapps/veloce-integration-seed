import { Dictionary } from 'lodash';
import { DebugSettings } from '../../modules/configuration-ui/configuration-ui.types';

export interface ConfigurationUiStateModel {
  debugSettings: Dictionary<Dictionary<DebugSettings | undefined>>;
}
