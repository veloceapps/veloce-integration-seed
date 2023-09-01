import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService, ToastType } from '@veloceapps/components';
import { UIDefinitionContainer, isDefined, isLegacyUIDefinition } from '@veloceapps/core';
import { CMSPreviewConfig } from '@veloceapps/sdk/cms';
import { ConfigurationRuntimeService, ConfigurationState } from '@veloceapps/sdk/core';
import { ModelsApiService } from 'apps/host/src/app/services/models.service';
import { Observable, Subject, catchError, filter, first, map, of, shareReplay, switchMap } from 'rxjs';

@Component({
  selector: 'app-definition',
  templateUrl: './definition.component.html',
  styleUrls: ['./definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefinitionComponent implements OnDestroy {
  public uiDefinition$: Observable<UIDefinitionContainer | undefined>;
  public isLegacy$: Observable<boolean>;
  public config: CMSPreviewConfig;

  private destroy$ = new Subject<void>();

  constructor(
    private service: ModelsApiService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private configurationState: ConfigurationState,
    private configurationRuntimeService: ConfigurationRuntimeService,
  ) {
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

    this.isLegacy$ = this.uiDefinition$.pipe(map(uiDef => (uiDef ? isLegacyUIDefinition(uiDef.source) : false)));

    this.config = {
      init$: () => this.init$(),
    };
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public init$(): Observable<void> {
    return this.uiDefinition$.pipe(
      filter(isDefined),
      first(),
      switchMap(uiDefinitionContainer => this.configurationRuntimeService.initTestMode(uiDefinitionContainer)),
      switchMap(() => this.configurationState.init$()),
    );
  }
}
