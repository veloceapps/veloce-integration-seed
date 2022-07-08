import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductModelApiService } from '@veloce/api';
import { ProductModel } from '@veloce/core';
import { combineLatest, map, Observable, of, shareReplay, switchMap } from 'rxjs';
import { ModelsApiService } from 'src/app/services/models.service';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelComponent {
  public modelDefinitions$: Observable<string[] | undefined>;
  public productModels$: Observable<ProductModel[]>;
  public modelId$: Observable<string | undefined>;

  constructor(
    private service: ModelsApiService,
    private route: ActivatedRoute,
    private productModelApi: ProductModelApiService
  ) {
    const productModelName$ = this.route.params.pipe(
      map(({ name }) => name),
      shareReplay()
    );

    this.modelDefinitions$ = productModelName$.pipe(
      switchMap((name?: string) => (name ? this.service.fetchAvailableModelDefinitions(name) : of(undefined))),
      shareReplay()
    );

    this.productModels$ = this.productModelApi.getModels(0, '').pipe(shareReplay());
    this.modelId$ = combineLatest([this.productModels$, productModelName$]).pipe(
      map(([models, modelName]) => models.find(model => model.name === modelName)?.id)
    );
  }
}
