import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CtmNodeViewComponent } from './ctm-node-view/ctm-node-view.component';
import { CtmNodesDashboardComponent } from './ctm-hosts-dashboard/ctm-nodes-dashboard.component';
import { RouterModule, Routes } from "@angular/router";
import { CommonUiModule } from "../common-ui";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MatCardModule } from "@angular/material/card";


const routes: Routes = [
  {
    path: '',
    component: CtmNodesDashboardComponent,
    data: {
      breadcrumbLabel: 'Nodes'
    }
  },
  {
    path: ':host',
    component: CtmNodeViewComponent,
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
export class CtmNodesRoutingModule { }


@NgModule({
  declarations: [
    CtmNodesDashboardComponent,
    CtmNodeViewComponent
  ],
  imports: [
    CommonModule,
    CtmNodesRoutingModule,
    CommonUiModule,
    NgbModule,
    MatCardModule,
  ],
  exports: [
    CtmNodesDashboardComponent,
    CtmNodeViewComponent
  ]
})
export class CtmNodesModule { }
