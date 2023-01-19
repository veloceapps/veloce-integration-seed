import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { FlowsApiService } from '@veloceapps/api';
import { FormErrorMessagesService } from '@veloceapps/components';
import { ConfigurationUiActions } from 'apps/host/src/app/state/configuration-ui/configuration-ui.actions';
import { Dictionary } from 'lodash';
import { BehaviorSubject, map, Subject, takeUntil, tap } from 'rxjs';
import { ConfigUiCard, DebugSettings, FlowProperties } from '../../configuration-ui.types';

@Component({
  selector: 'app-debug-settings',
  templateUrl: './debug-settings.component.html',
  styleUrls: ['./debug-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormErrorMessagesService],
})
export class DebugSettingsComponent implements OnInit, OnChanges, OnDestroy {
  private readonly productFlowEntryPaths = ['/product', '/legacy/product'];

  @Input() card?: ConfigUiCard;

  @Output() close = new EventEmitter<MouseEvent>();
  @Output() save = new EventEmitter<DebugSettings | undefined>();

  public flows$ = new BehaviorSubject<FlowProperties[]>([]);

  public formControls = {
    id: new FormControl(null, Validators.required),
    debugMode: new FormControl(false),
    flowId: new FormControl(null, Validators.required),
  };
  public form = new FormGroup(this.formControls);

  labels: Dictionary<string> = {
    id: 'SF Object ID',
    flowId: 'Flow',
  };

  destroy$ = new Subject<void>();

  constructor(private flowsApiService: FlowsApiService, private store: Store) {
    this.fetchFlows();
  }

  ngOnInit(): void {
    this.formControls.debugMode.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(debugMode => {
      if (debugMode) {
        this.formControls.id.enable();
        this.formControls.flowId.enable();
      } else {
        this.formControls.id.disable();
        this.formControls.flowId.disable();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.card) {
      this.initForm(changes.card.currentValue);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private fetchFlows(): void {
    this.flowsApiService
      .fetchFlows()
      .pipe(
        map(flows =>
          flows
            .filter(flow => this.productFlowEntryPaths.includes(flow.properties.entryPath))
            .map<FlowProperties>(flow => {
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
    if (this.form.invalid || !this.card) {
      return;
    }

    const flowId = this.formControls.flowId.value;
    const flow = this.flows$.value.find(({ id }) => id === flowId);
    const settings: DebugSettings | undefined =
      this.formControls.debugMode.value && flow
        ? {
            flow,
            objectId: this.formControls.id.value,
          }
        : undefined;

    const { model, ui } = this.card;
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
