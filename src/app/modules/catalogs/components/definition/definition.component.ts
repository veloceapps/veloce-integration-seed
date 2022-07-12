import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UIDefinition } from '@veloce/sdk/cms';
import { map, Observable, of, shareReplay, switchMap } from 'rxjs';
import { CatalogsApiService } from 'src/app/services/catalogs.service';

@Component({
  selector: 'app-definition',
  templateUrl: './definition.component.html',
  styleUrls: ['./definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefinitionComponent {
  public definition$: Observable<UIDefinition | undefined>;

  constructor(private service: CatalogsApiService, private route: ActivatedRoute) {
    this.definition$ = this.route.params.pipe(
      switchMap(({ name, definition }) =>
        name && definition ? this.service.fetchDefinition(name, definition) : of(undefined)
      ),
      shareReplay()
    );
  }
}
