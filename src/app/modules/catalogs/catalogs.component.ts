import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Observable, shareReplay, Subject } from 'rxjs';
import { CatalogsApiService } from 'src/app/services/catalogs.service';

@Component({
  selector: 'app-catalogs',
  templateUrl: './catalogs.component.html',
  styleUrls: ['./catalogs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogsComponent implements OnDestroy {
  public catalogsNames$: Observable<string[]>;

  private destroy$ = new Subject<void>();

  constructor(private service: CatalogsApiService) {
    this.catalogsNames$ = this.service.fetchCatalogsNames().pipe(shareReplay());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
