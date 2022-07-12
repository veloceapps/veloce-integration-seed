import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Observable, shareReplay, Subject } from 'rxjs';
import { ModelsApiService } from 'src/app/services/models.service';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelsComponent implements OnDestroy {
  public modelsNames$: Observable<string[]>;

  private destroy$ = new Subject<void>();

  constructor(private service: ModelsApiService) {
    this.modelsNames$ = this.service.fetchModelsNames().pipe(shareReplay());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
