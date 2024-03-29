import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CatalogsApiService } from 'apps/host/src/app/services/catalogs.service';
import { map, Observable, of, shareReplay, switchMap } from 'rxjs';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogComponent {
  public catalogDefinitions$: Observable<string[] | undefined>;

  constructor(private service: CatalogsApiService, private route: ActivatedRoute) {
    this.catalogDefinitions$ = this.route.params.pipe(
      map(({ name }) => name),
      switchMap((catalogName?: string) =>
        catalogName ? this.service.fetchAvailableCatalogDefinitions(catalogName) : of(undefined)
      ),
      shareReplay()
    );
  }
}
