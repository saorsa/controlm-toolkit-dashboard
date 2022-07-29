import { Component, OnDestroy } from '@angular/core';
import { NavigationService } from "./services";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnDestroy {

  constructor(
    readonly navigation: NavigationService,
  ) {
  }

  ngOnDestroy(): void {
  }
}

