import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentStoryPreview } from '@veloceapps/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { TemplatesApiService } from '../../../services/templates.service';

@Component({
  selector: 'app-template-story-component',
  templateUrl: 'template-story.component.html',
  styleUrls: ['template-story.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateStoryComponent {
  public story$: Observable<ComponentStoryPreview | undefined>;

  constructor(private route: ActivatedRoute, private service: TemplatesApiService) {
    this.story$ = this.route.params.pipe(
      switchMap(params => {
        const { templateName, componentName, storyName } = params;

        if (!templateName || !componentName || !storyName) {
          return of(undefined);
        }

        return this.service.fetchStory(templateName, componentName, storyName);
      }),
      map(data => {
        if (!data) {
          return;
        }

        return {
          ...data,
          id: '',
          uiComponentId: '',
        };
      }),
    );
  }
}
