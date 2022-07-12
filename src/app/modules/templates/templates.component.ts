import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { combineLatest, map, Observable, shareReplay, Subject, takeUntil, withLatestFrom } from 'rxjs';
import { RouterService } from '../../services/router.service';
import { TemplatesApiService } from '../../services/templates.service';
import { Template } from '../../types/templates.types';

interface StoryNode {
  templateName: string;
  componentName: string;
  storyName: string;
}

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesComponent implements OnDestroy {
  public templates$: Observable<TreeNode<any>[]>;
  public selectedNode?: TreeNode<StoryNode>;

  private destroy$ = new Subject<void>();

  constructor(
    private service: TemplatesApiService,
    private routerService: RouterService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const templates$ = this.service.fetchTemplates().pipe(shareReplay());

    this.templates$ = templates$.pipe(
      withLatestFrom(this.routerService.params$),
      map(([templates, params]) => this.toTreeView(templates, params))
    );

    combineLatest([this.templates$, this.routerService.params$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([templates, params]) => this.updateSelection(templates, params));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateSelection(
    templates: TreeNode<any>[],
    { templateName, componentName, storyName }: { [key: string]: string }
  ) {
    let node: TreeNode<StoryNode> | undefined;

    for (const template of templates) {
      for (const component of template.children ?? []) {
        for (const story of component.children ?? []) {
          if (templateName === template.label && componentName === component.label && storyName === story.label) {
            node = story;
            break;
          }
        }

        if (node) {
          break;
        }
      }

      if (node) {
        break;
      }
    }

    return node;
  }

  private toTreeView(
    templates: Template[],
    { templateName, componentName, storyName }: { [key: string]: string }
  ): TreeNode<any>[] {
    return templates.map<TreeNode<any>>(template => {
      return {
        label: template.name,
        expanded: template.name === templateName,
        selectable: false,
        children: template.components.map<TreeNode<any>>(component => {
          return {
            label: component.name,
            expanded: component.name === componentName,
            selectable: false,
            children: component.stories.map<TreeNode<any>>(story => {
              const node: TreeNode<StoryNode> = {
                data: {
                  templateName: template.name,
                  componentName: component.name,
                  storyName: story
                },
                label: story,
                selectable: true
              };

              if (templateName === template.name && component.name === componentName && story === storyName) {
                this.selectedNode = node;
              }

              return node;
            })
          };
        })
      };
    });
  }

  public handleNodeSelect(node: TreeNode<StoryNode>) {
    this.selectedNode = node;

    if (node.data) {
      this.router.navigate([node.data.templateName, node.data.componentName, node.data.storyName], {
        relativeTo: this.route
      });
    }
  }
}
