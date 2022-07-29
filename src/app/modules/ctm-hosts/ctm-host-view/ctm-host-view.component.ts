import { Component, OnInit } from '@angular/core';
import { ApiService, AppService, CtmNodeInfo } from "../../../services";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { NgbNavChangeEvent } from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'app-ctm-host-view',
  templateUrl: './ctm-host-view.component.html',
  styleUrls: ['./ctm-host-view.component.sass']
})
export class CtmHostViewComponent implements OnInit {

  stats: CtmNodeInfo | null = null;
  error: any = null;
  loading = false;
  selectedServer?: string;
  selectedHost?: string;
  serverChangeSubscription?: Subscription;
  paramMonitorSubscription?: Subscription;
  active: any;


  get folderKeys(): { index: number, folder: string }[]   {
    return (this.stats?.folders || []).map((f, index) => {
      return {
        index: index,
        folder: f,
      }
    })
  }

  get jobKeys(): { index: number, folder: string, job: { folder: string, jobName: string }}[]   {
    return (this.stats?.jobs || []).map((key, index) => {
      const split = key.indexOf('/') >= 0 ? key.split('/') : [ 'ERROR', key];
      return {
        index: index,
        folder: split[0],
        job: {
          folder: split[0],
          jobName: split[1],
        }
      }
    })
  }

  constructor(
    private readonly api: ApiService,
    private readonly app: AppService,
    private readonly activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.paramMonitorSubscription = this.activatedRoute.params.subscribe({
      next: (p) => {
        const host = p['host'];
        this.loadNodeStats(this.app.selectedServer, host);
        this.serverChangeSubscription = this.app.serverChange.subscribe(server => {
          this.loadNodeStats(server, host);
        })
      },
      error: (err) => {
        this.error = err;
        console.error('Activated route parameter error', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.serverChangeSubscription?.unsubscribe();
    this.paramMonitorSubscription?.unsubscribe();
  }

  onNavChange(_: NgbNavChangeEvent) {
  }

  protected loadNodeStats(server: string | undefined, host: string): void {
    if (server) {
      this.loading = true;
      this.selectedServer = server;
      this.selectedHost = host;
      this.api.getNodeDetails(server, this.selectedHost).subscribe({
        next: (result) => {
          this.stats = result;
          this.loading = false;
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
        }
      });
    }
    else {
      this.error = new Error("No Control-M Server is selected.");
      this.loading = false;
      this.stats = null;
    }
  }
}
