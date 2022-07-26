import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, AppService, NavigationService } from "./services";
import { RootChooseServerComponent } from './components/root-choose-server/root-choose-server.component';
import { RootServerComponent } from './components/root-server/root-server.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { CtmOverviewModule } from "./modules/ctm-overview/ctm-overview.module";
import { CtmAppsModule } from "./modules/ctm-apps/ctm-apps.module";
import { CtmSubAppsModule } from "./modules/ctm-sub-apps/ctm-sub-apps.module";
import { CtmFoldersModule } from "./modules/ctm-folders/ctm-folders.module";
import { CtmJobsModule } from "./modules/ctm-jobs/ctm-jobs.module";
import { CtmNodesModule } from "./modules/ctm-nodes";
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';


@NgModule({
  declarations: [
    AppComponent,
    RootChooseServerComponent,
    RootServerComponent,
    BreadcrumbsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,

    CtmOverviewModule,
    CtmAppsModule,
    CtmSubAppsModule,
    CtmFoldersModule,
    CtmJobsModule,
    CtmNodesModule,
  ],
  providers: [
    ApiService,
    AppService,
    NavigationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
