import {
  Component, OnInit, Input, TemplateRef
} from '@angular/core';
import {
  NgbModal, NgbModalRef
} from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'app-inspect-button',
  templateUrl: './inspect-button.component.html',
  styleUrls: ['./inspect-button.component.sass']
})
export class InspectButtonComponent implements OnInit {

  @Input() buttonText: string = 'Inspect';
  @Input() dialogTitle?: string = 'Inspect';
  @Input() dialogTemplateRef?: TemplateRef<any>;
  @Input() data: any;
  dialogCloseResult?: any;
  dialogRef?: NgbModalRef;

  constructor(
    private modal: NgbModal
  ) { }

  ngOnInit(): void {
  }

  openDialog(content: TemplateRef<any>): void {
    this.dialogRef = this.modal.open(content);
    this.dialogRef.result.then((result) => {
      this.dialogCloseResult = `Closed with: ${result}`;
    }, (reason) => {
      this.dialogCloseResult = `Dismissed ${reason}`;
    });
  }
}
