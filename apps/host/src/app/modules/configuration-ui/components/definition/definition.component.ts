import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductModelApiService } from '@veloceapps/api';
import { ToastService, ToastType } from '@veloceapps/components';
import { ModelsApiService } from 'apps/host/src/app/services/models.service';
import { catchError, map, Observable, of, shareReplay, Subject, switchMap } from 'rxjs';
import { UIDef } from '../../../../types/ui.types';
import { isLegacyDefinition } from '../../../../utils/ui.utils';

@Component({
  selector: 'app-definition',
  templateUrl: './definition.component.html',
  styleUrls: ['./definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefinitionComponent implements OnDestroy {
  // public modelId = '';
  public uiDefinition$: Observable<UIDef | undefined>;
  public isLegacy$: Observable<boolean>;
  public modelId$: Observable<string | undefined>;

  private destroy$ = new Subject<void>();

  constructor(
    private service: ModelsApiService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private pmApiService: ProductModelApiService,
  ) {
    this.modelId$ = this.route.params.pipe(
      switchMap(({ name }) =>
        this.pmApiService.getModels(0, '').pipe(map(models => models.find(model => model.name === name))),
      ),
      map(model => model?.id),
      shareReplay(),
    );

    this.uiDefinition$ = this.route.params.pipe(
      switchMap(({ name, definition }) =>
        name && definition ? this.service.fetchModelDefinition(name, definition) : of(undefined),
      ),
      catchError(e => {
        console.error(e);
        this.toastService.add({ severity: ToastType.error, summary: e?.error?.message ?? 'Something went wrong' });
        return of(undefined);
      }),
      shareReplay(),
    );

    this.isLegacy$ = this.uiDefinition$.pipe(map(uiDef => (uiDef ? isLegacyDefinition(uiDef) : false)));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
