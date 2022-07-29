import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InspectButtonComponent } from './inspect-button/inspect-button.component';
import { SmartTableComponent } from './smart-table/smart-table.component';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";


@NgModule({
  declarations: [
    SmartTableComponent,
    InspectButtonComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    SmartTableComponent
  ]
})
export class CommonUiModule { }
