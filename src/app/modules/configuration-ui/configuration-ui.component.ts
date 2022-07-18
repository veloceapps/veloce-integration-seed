import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Params } from '@angular/router';
import { Store } from '@ngxs/store';
import { BehaviorSubject, forkJoin, map, Observable, Subject, switchMap, tap } from 'rxjs';
import { ModelsApiService } from 'src/app/services/models.service';
import { ConfigurationUiState } from 'src/app/state/configuration-ui/configuration-ui.state';
import { ConfigUiCard, DebugSettings } from './configuration-ui.types';

@Component({
  selector: 'app-configuration-ui',
  templateUrl: './configuration-ui.component.html',
  styleUrls: ['./configuration-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigurationUiComponent implements OnInit, OnDestroy {
  cards$ = new BehaviorSubject<ConfigUiCard[] | null>(null);

  selectedCard: ConfigUiCard | undefined;

  private destroy$ = new Subject<void>();

  constructor(private service: ModelsApiService, private store: Store) {}

  ngOnInit(): void {
    this.fetchUiDefs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private fetchUiDefs(): void {
    this.service
      .fetchModelsNames()
      .pipe(
        map(modelsNames =>
          modelsNames.reduce(
            (acc, name) => ({
              ...acc,
              [name]: this.service.fetchAvailableModelDefinitions(name),
            }),
            {} as { [key: string]: Observable<string[]> },
          ),
        ),
        switchMap(uis => forkJoin(uis)),
        switchMap(uis =>
          this.store.select(ConfigurationUiState.getDebugSettings).pipe(
            map(settings =>
              Object.entries(uis).reduce((acc, [modelName, uiNames]) => {
                return [...acc, ...uiNames.map(ui => this.getCard(modelName, ui, settings[modelName]?.[ui]))];
              }, [] as ConfigUiCard[]),
            ),
          ),
        ),

        tap(cards => this.cards$.next(cards)),
        tap(cards => console.log(cards)),
      )
      .subscribe();
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

    const queryParams: Params = {
      flowId: settings.flow.id,
      quoteId: settings.objectId,
      ...settings.flow.queryParams,
    };

    return {
      model,
      ui,
      queryParams,
      link: `/configuration-ui/flow${settings.flow.entryPath}`,
      debugSettings: settings,
    };
  }
}
