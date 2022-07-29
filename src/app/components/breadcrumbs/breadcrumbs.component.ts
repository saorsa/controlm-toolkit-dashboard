import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationBreadcrumb, NavigationService } from "../../services";
import {
  Subscription
} from "rxjs";

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.sass']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {

  private navigationSubscription?: Subscription;
  currentBreadcrumbs: NavigationBreadcrumb[] = [];

  constructor(
    private navigation: NavigationService,
  ) {
    this.currentBreadcrumbs = navigation.breadcrumbs;
  }

  ngOnInit(): void {
    this.navigationSubscription = this.navigation.breadcrumbsChange.subscribe({
      next: (breadcrumbs) => {
        this.currentBreadcrumbs = breadcrumbs;
      }
    });
  }

  ngOnDestroy(): void {
    this.navigationSubscription?.unsubscribe();
  }
}
