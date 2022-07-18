import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ConfigurationUiActions } from './configuration-ui.actions';
import { ConfigurationUiStateModel } from './configuration-ui.types';

@State<ConfigurationUiStateModel>({
  name: 'configurationui',
  defaults: {
    debugSettings: {},
  },
})
@Injectable()
export class ConfigurationUiState {
  constructor() {}

  @Selector()
  static getDebugSettings(state: ConfigurationUiStateModel) {
    return state.debugSettings;
  }

  @Action(ConfigurationUiActions.SetDebugSettings)
  setDebugSettings(ctx: StateContext<ConfigurationUiStateModel>, action: ConfigurationUiActions.SetDebugSettings) {
    const state = ctx.getState();

    ctx.setState({
      debugSettings: {
        ...state.debugSettings,
        [action.payload.model]: {
          ...state.debugSettings[action.payload.model],
          [action.payload.ui]: action.payload.settings,
        },
      },
    });
  }
}
