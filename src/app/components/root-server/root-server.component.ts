import { Component, OnInit } from '@angular/core';
import { ApiService, AppService } from "../../services";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { NgbOffcanvas, NgbOffcanvasRef, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-root-server',
  templateUrl: './root-server.component.html',
  styleUrls: ['./root-server.component.sass']
})
export class RootServerComponent implements OnInit {

  protected paramMonitorSubscription?: Subscription;

  title = 'Control-M Toolkit';
  chooseServerOffCanvas?: NgbOffcanvasRef;
  chooseServerResult: any;
  selectedServer?: string;
  error: any = null;
  loading = false;

  constructor(
    private readonly offCanvasService: NgbOffcanvas,
    private readonly activatedRoute: ActivatedRoute,
    private readonly api: ApiService,
    private readonly app: AppService,
  ){ }

  ngOnInit(): void {
    this.monitorActivatedRoute();
    this.loadServers();
  }

  ngOnDestroy(): void {
    this.paramMonitorSubscription?.unsubscribe();
  }

  open(templateRef: any) {
    this.chooseServerOffCanvas = this.offCanvasService.open(templateRef, {
      position: 'end'
    });
    this.chooseServerOffCanvas.result.then((result) => {
      this.chooseServerResult = `Closed with: ${result}`;
    }, (reason) => {
      this.chooseServerResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  protected getDismissReason(reason: any): string {
    if (reason === OffcanvasDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === OffcanvasDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on the backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  protected monitorActivatedRoute(): void {
    this.paramMonitorSubscription = this.activatedRoute.params.subscribe({
      next: (p) => {
        this.selectedServer = p['server'];
        this.app.selectedServer = this.selectedServer;
      },
      error: (err) => {
        this.error = err;
        console.error('Activated route parameter error', err);``
      }
    });
  }

  protected loadServers(): void {
    this.loading = true;
  }

}
