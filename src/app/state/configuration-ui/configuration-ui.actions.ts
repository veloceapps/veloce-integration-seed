import { DebugSettings } from 'src/app/modules/configuration-ui/configuration-ui.types';

export namespace ConfigurationUiActions {
  export class SetDebugSettings {
    static readonly type = '[Configuration UI] Set Debug Settings';

    constructor(public payload: { model: string; ui: string; settings?: DebugSettings }) {}
  }
}
