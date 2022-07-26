import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootChooseServerComponent } from "./components/root-choose-server/root-choose-server.component";
import { RootServerComponent } from "./components/root-server/root-server.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: RootChooseServerComponent,
  },
  {
    path: ':server',
    component: RootServerComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview'
      },
      {
        path: 'overview',
        loadChildren: () => import('./modules/ctm-overview/ctm-overview.module').then(m => m.CtmOverviewModule),
      },
      {
        path: 'apps',
        loadChildren: () => import('./modules/ctm-apps/ctm-apps.module').then(m => m.CtmAppsModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
