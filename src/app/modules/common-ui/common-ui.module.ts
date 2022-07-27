import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartTableComponent } from './smart-table/smart-table.component';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";



@NgModule({
  declarations: [
    SmartTableComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
  ],
  exports: [
    SmartTableComponent
  ]
})
export class CommonUiModule { }
