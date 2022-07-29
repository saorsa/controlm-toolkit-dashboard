import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CtmHostViewComponent } from './ctm-host-view/ctm-host-view.component';
import { CtmHostsDashboardComponent } from './ctm-hosts-dashboard/ctm-hosts-dashboard.component';
import { RouterModule, Routes } from "@angular/router";
import { CommonUiModule } from "../common-ui";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MatCardModule } from "@angular/material/card";


const routes: Routes = [
  {
    path: '',
    component: CtmHostsDashboardComponent,
    data: {
      breadcrumbLabel: 'Hosts'
    }
  },
  {
    path: ':host',
    component: CtmHostViewComponent,
    data: {
      breadcrumbLabel: 'Preview'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [
  ]
})
export class CtmHostsRoutingModule { }


@NgModule({
  declarations: [
    CtmHostsDashboardComponent,
    CtmHostViewComponent
  ],
  imports: [
    CommonModule,
    CtmHostsRoutingModule,
    CommonUiModule,
    NgbModule,
    MatCardModule,
  ],
  exports: [
    CtmHostsDashboardComponent,
    CtmHostViewComponent
  ]
})
export class CtmHostsModule { }
