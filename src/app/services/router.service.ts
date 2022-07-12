import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Event, NavigationEnd, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, startWith } from 'rxjs/operators';

@Injectable()
export class RouterService {
  private routeChange$: Observable<Event>;
  private lastChildParams$: Observable<Params>;
  private lastChildRoute$: Observable<ActivatedRouteSnapshot>;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.routeChange$ = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      shareReplay()
    );

    this.lastChildParams$ = this.watchLastChildParams$(this.route).pipe(
      startWith(this.getLastChildParams(this.route.snapshot)),
      shareReplay()
    );
    this.lastChildRoute$ = this.watchLastChildRoute$(this.route).pipe(
      startWith(this.getLastChildRoute(this.route.snapshot)),
      shareReplay()
    );
  }

  get route$(): Observable<ActivatedRouteSnapshot> {
    return this.lastChildRoute$;
  }

  get params$(): Observable<Params> {
    return this.lastChildParams$;
  }

  private getLastChildRoute = (route: ActivatedRouteSnapshot): ActivatedRouteSnapshot => {
    return route.firstChild ? this.getLastChildRoute(route.firstChild) : route;
  };

  private watchLastChildRoute$ = (route: ActivatedRoute): Observable<ActivatedRouteSnapshot> => {
    return this.routeChange$.pipe(map(() => this.getLastChildRoute(route.snapshot)));
  };

  private getLastChildParams = (route: ActivatedRouteSnapshot): Params => {
    return route.firstChild ? this.getLastChildParams(route.firstChild) : route.params;
  };

  private watchLastChildParams$ = (route: ActivatedRoute): Observable<Params> => {
    return this.routeChange$.pipe(map(() => this.getLastChildParams(route.snapshot)));
  };
}
