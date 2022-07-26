import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CtmOverviewDashboardComponent } from './ctm-overview-dashboard/ctm-overview-dashboard.component';
import { RouterModule, Routes } from "@angular/router";
import {ApiService} from "../../services/api.service";

const routes: Routes = [
  {
    path: '',
    component: CtmOverviewDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CtmOverviewRoutingModule { }

@NgModule({
  declarations: [
    CtmOverviewDashboardComponent
  ],
  imports: [
    CommonModule,
    CtmOverviewRoutingModule,
  ],
  providers: [
    ApiService,
  ],
  exports: [
    CtmOverviewDashboardComponent,
  ]
})
export class CtmOverviewModule { }
