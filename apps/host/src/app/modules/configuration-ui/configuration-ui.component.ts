import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Params } from '@angular/router';
import { Store } from '@ngxs/store';
import { getFlowObjectIdPropertyName } from '@veloce/sdk';
import { ModelsApiService } from 'apps/host/src/app/services/models.service';
import { ConfigurationUiState } from 'apps/host/src/app/state/configuration-ui/configuration-ui.state';
import { Dictionary } from 'lodash';
import { BehaviorSubject, forkJoin, map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ConfigUiCard, DebugSettings } from './configuration-ui.types';

@Component({
  selector: 'app-configuration-ui',
  templateUrl: './configuration-ui.component.html',
  styleUrls: ['./configuration-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigurationUiComponent implements OnInit, OnDestroy {
  cards$ = new BehaviorSubject<ConfigUiCard[] | null>(null);

  selectedCard?: ConfigUiCard;

  private destroy$ = new Subject<void>();

  constructor(private service: ModelsApiService, private store: Store) {}

  ngOnInit(): void {
    this.service
      .fetchModelsNames()
      .pipe(
        map(modelsNames => this.getUiDefinitionsByModel$(modelsNames)),
        switchMap(uiDefs$ => (Object.keys(uiDefs$).length ? forkJoin(uiDefs$) : of({}))),
        switchMap(uiDefs => this.mapUisToCards$(uiDefs)),
        takeUntil(this.destroy$),
      )
      .subscribe(cards => this.cards$.next(cards));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getUiDefinitionsByModel$(modelsNames: string[]): { [key: string]: Observable<string[]> } {
    return modelsNames.reduce(
      (acc, name) => ({
        ...acc,
        [name]: this.service.fetchAvailableModelDefinitions(name),
      }),
      {} as { [key: string]: Observable<string[]> },
    );
  }

  private mapUisToCards$(uis: Dictionary<string[]>): Observable<ConfigUiCard[]> {
    return this.store.select(ConfigurationUiState.getDebugSettings).pipe(
      map(settings =>
        Object.entries(uis).reduce((acc, [modelName, uiNames]) => {
          return [...acc, ...uiNames.map(ui => this.getCard(modelName, ui, settings[modelName]?.[ui]))];
        }, [] as ConfigUiCard[]),
      ),
    );
  }

  public openDebugPanel(event: MouseEvent, card?: ConfigUiCard): void {
    event.stopPropagation();
    event.preventDefault();

    this.selectedCard = card;
  }

  private getCard(model: string, ui: string, settings?: DebugSettings): ConfigUiCard {
    if (!settings) {
      return {
        model,
        ui,
        link: `/configuration-ui/${model}/${ui}`,
      };
    }

    const objectPropertyName = getFlowObjectIdPropertyName(settings.objectId);
    const queryParams: Params = {
      flowId: settings.flow.id,
      [objectPropertyName]: settings.objectId,
      ...settings.flow.queryParams,
    };

    return {
      model,
      ui,
      queryParams,
      link: `/configuration-ui/flow/flows`,
      debugSettings: settings,
    };
  }
}
