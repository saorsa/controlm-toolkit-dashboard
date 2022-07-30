import { Injectable, OnDestroy } from '@angular/core';
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  ActivationEnd,
  ActivatedRouteSnapshot
} from "@angular/router";
import { Subject, Subscription } from "rxjs";


export interface NavigationBreadcrumb {
  /**
   * The root relative URL of the breadcrumb.
   */
  url: string,
  /**
   * The display label of the breadcrumb.
   */
  label: string,
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService implements OnDestroy {

  private _routerSubscription?: Subscription;
  private readonly _routeSnapshots: ActivatedRouteSnapshot[] = [];
  private _breadcrumbs: NavigationBreadcrumb[] = [];
  private readonly _breadcrumbsChange = new Subject<NavigationBreadcrumb[]>;

  get breadcrumbs(): NavigationBreadcrumb[] {
    return this._breadcrumbs;
  }

  get breadcrumbsChange(): Subject<NavigationBreadcrumb[]> {
    return this._breadcrumbsChange;
  }

  constructor(
    private router: Router
  ) {
    this._routerSubscription = this.router.events.subscribe({
      next: (event: RouterEvent) => {
        if (event instanceof NavigationStart) {
          this._routeSnapshots.length = 0;
        }
        if (event instanceof ActivationEnd && event.snapshot.url.length) {
          this._routeSnapshots.splice(0, 0, event.snapshot);
        }
        if (event instanceof NavigationEnd){
          this._breadcrumbs = this.buildBreadcrumbs();
          this.breadcrumbsChange.next(this._breadcrumbs);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this._routerSubscription?.unsubscribe();
  }

  buildBreadcrumbs(): NavigationBreadcrumb[] {
    let lastPath = '';
    return this._routeSnapshots.map(snapshot => {
      if (snapshot.url.length <= 0) {
        throw new Error(`Invalid route snapshot for breadcrumb, its url segments array is empty.`);
      }
      if (snapshot.url.length >= 2) {
        throw new Error(
          `Invalid route snapshot for breadcrumb, its url segments array (${snapshot.url}) contains multiple segments.`);
      }
      lastPath = `${lastPath}/${snapshot.url[0]}`
      const label = snapshot.data['breadcrumbLabel'] ? snapshot.data['breadcrumbLabel'] : snapshot.url[0]
      return {
        url: lastPath,
        label: label,
      }
    });
  }
}
