import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { FormErrorMessagesService } from '@veloce/components';
import { FlowService } from '@veloce/sdk';
import { Dictionary } from 'lodash';
import { BehaviorSubject, map, tap } from 'rxjs';
import { ConfigurationUiActions } from 'src/app/state/configuration-ui/configuration-ui.actions';
import { ConfigUiCard, DebugSettings, FlowProperties } from '../../configuration-ui.types';

@Component({
  selector: 'app-debug-settings',
  templateUrl: './debug-settings.component.html',
  styleUrls: ['./debug-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormErrorMessagesService],
})
export class DebugSettingsComponent {
  @Input()
  set card(data: ConfigUiCard | undefined) {
    this._card = data;
    this.initForm(data);
  }

  @Output() close = new EventEmitter<MouseEvent>();
  @Output() save = new EventEmitter<DebugSettings | undefined>();

  _card?: ConfigUiCard;

  public formControls = {
    id: new FormControl(null, Validators.required),
    debugMode: new FormControl(false),
    flowId: new FormControl(null, Validators.required),
  };
  public form = new FormGroup(this.formControls);

  public flows$ = new BehaviorSubject<FlowProperties[]>([]);

  labels: Dictionary<string> = {
    id: 'SF Object ID',
    flowId: 'Flow',
  };

  constructor(private flowService: FlowService, private store: Store) {
    this.fetchFlows();
  }

  private fetchFlows(): void {
    this.flowService
      .fetchFlows()
      .pipe(
        map(flows =>
          flows.map<FlowProperties>(flow => {
            const queryParams = flow?.properties?.queryParams ?? {};
            return {
              id: flow.id,
              entryPath: flow?.properties?.entryPath,
              queryParams,
              queryParamsStr: JSON.stringify(queryParams),
            };
          }),
        ),
        tap(flows => this.flows$.next(flows)),
      )
      .subscribe();
  }

  private initForm(card?: ConfigUiCard): void {
    this.form.reset({
      id: card?.debugSettings?.objectId,
      debugMode: !!card?.debugSettings,
      flowId: card?.debugSettings?.flow.id,
    });
  }

  public saveHandler(event: MouseEvent): void {
    const flowId = this.formControls.flowId.value;
    const flow = this.flows$.value.find(({ id }) => id === flowId);

    if (this.form.invalid || !flow || !this._card) {
      return;
    }

    const settings: DebugSettings | undefined = this.formControls.debugMode.value
      ? {
          flow,
          objectId: this.formControls.id.value,
        }
      : undefined;

    const { model, ui } = this._card;
    this.store.dispatch(new ConfigurationUiActions.SetDebugSettings({ model, ui, settings }));

    this.close.emit(event);
  }

  public closeHandler(event: MouseEvent): void {
    this.close.emit(event);
  }

  public selectFlowHandler(flowId: string): void {
    this.formControls.flowId.setValue(flowId);
  }
}
