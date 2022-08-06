import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CtmFolderViewComponent, CtmFoldersDashboardComponent
} from '.';
import { RouterModule, Routes } from "@angular/router";


const routes: Routes = [
  {
    path: '',
    component: CtmFoldersDashboardComponent,
    data: {
      breadcrumbLabel: 'Folders'
    }
  },
  {
    path: ':folder',
    component: CtmFolderViewComponent,
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
export class CtmFoldersRoutingModule { }

@NgModule({
  declarations: [
    CtmFoldersDashboardComponent,
    CtmFolderViewComponent
  ],
  imports: [
    CommonModule,
    CtmFoldersRoutingModule
  ]
})
export class CtmFoldersModule { }
