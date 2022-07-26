import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CtmAppsDashboardComponent } from './ctm-apps-dashboard/ctm-apps-dashboard.component';
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: '',
    component: CtmAppsDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CtmAppsRoutingModule { }

@NgModule({
  declarations: [
    CtmAppsDashboardComponent
  ],
  imports: [
    CommonModule,
    CtmAppsRoutingModule
  ]
})
export class CtmAppsModule { }
