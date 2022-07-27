import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CtmHostViewComponent } from './ctm-host-view/ctm-host-view.component';
import { CtmHostsDashboardComponent } from './ctm-hosts-dashboard/ctm-hosts-dashboard.component';
import { RouterModule, Routes } from "@angular/router";
import { CommonUiModule } from "../common-ui/common-ui.module";


const routes: Routes = [
  {
    path: '',
    component: CtmHostsDashboardComponent,
  },
  {
    path: ':host',
    component: CtmHostViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [
    CtmHostViewComponent
  ]
})
export class CtmHostsRoutingModule { }


@NgModule({
  declarations: [
    CtmHostsDashboardComponent
  ],
  imports: [
    CommonModule,
    CtmHostsRoutingModule,
    CommonUiModule,
  ],
  exports: [
    CtmHostsDashboardComponent,
  ]
})
export class CtmHostsModule { }