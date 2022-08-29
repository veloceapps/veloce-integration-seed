import { ChangeDetectionStrategy, Component, ViewContainerRef } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { combineLatest, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { RouterService } from '../../services/router.service';
import { navigationItems } from './navigation.definitions';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent {
  public items: MenuItem[] = navigationItems;

  public activeItem$: Observable<MenuItem>;

  private route$: Observable<ActivatedRouteSnapshot>;

  constructor(
    private readonly viewRef: ViewContainerRef,
    private router: Router,
    private routerService: RouterService
  ) {
    this.route$ = this.routerService.route$;

    this.activeItem$ = this.route$.pipe(
      map(() => this.items.find(item => item.routerLink && this.router.url.startsWith(item.routerLink)) as MenuItem),
      shareReplay()
    );
  }

  public stopSettingsClickPropagation(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    // continue propagation to the root element
    this.viewRef.element.nativeElement.dispatchEvent(new Event(e.type, e));
  }

  private replaceId(routerLink: string, id: string | null): string {
    return id ? routerLink.replace(':id', id) : routerLink;
  }
}
