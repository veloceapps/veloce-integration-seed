import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService, ToastType } from '@veloce/components';
import { catchError, map, Observable, of, shareReplay, Subject, switchMap, takeUntil } from 'rxjs';
import { ModelsApiService } from 'src/app/services/models.service';
import { UIDef } from '../../../../types/ui.types';
import { isLegacyDefinition } from '../../../../utils/ui.utils';

@Component({
  selector: 'app-definition',
  templateUrl: './definition.component.html',
  styleUrls: ['./definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefinitionComponent implements OnDestroy {
  public modelId = '';
  public uiDefinition$: Observable<UIDef | undefined>;
  public isLegacy$: Observable<boolean>;

  private destroy$ = new Subject<void>();

  constructor(private service: ModelsApiService, private route: ActivatedRoute, private toastService: ToastService) {
    this.route.queryParams
      .pipe(
        map(params => (this.modelId = params.modelId)),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.uiDefinition$ = this.route.params.pipe(
      switchMap(({ name, definition }) =>
        name && definition ? this.service.fetchModelDefinition(name, definition) : of(undefined)
      ),
      catchError(e => {
        console.error(e);
        this.toastService.add({ severity: ToastType.error, summary: e?.error?.message ?? 'Something went wrong' });
        return of(undefined);
      }),
      shareReplay()
    );

    this.isLegacy$ = this.uiDefinition$.pipe(map(uiDef => (uiDef ? isLegacyDefinition(uiDef) : false)));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
