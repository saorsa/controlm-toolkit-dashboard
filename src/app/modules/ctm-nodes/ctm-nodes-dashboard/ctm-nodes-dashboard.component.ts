import { Component, OnInit } from '@angular/core';
import { ApiService, AppService, CtmNodeStat } from "../../../services";
import { CtmNodeBasicInfo } from "../../../services";
import { Subscription } from "rxjs";


@Component({
  selector: 'app-ctm-nodes-dashboard',
  templateUrl: './ctm-nodes-dashboard.component.html',
  styleUrls: ['./ctm-nodes-dashboard.component.sass']
})
export class CtmNodesDashboardComponent implements OnInit {

  stats: CtmNodeStat[] | null = null;
  error: any = null;
  loading = false;
  serverChangeSubscription?: Subscription;

  constructor(
    private readonly api: ApiService,
    private readonly app: AppService,
  ) { }

  ngOnInit(): void {
    this.loadNodeStats(this.app.selectedServer);
    this.serverChangeSubscription = this.app.serverChange.subscribe(server => {
      this.loadNodeStats(server);
    })
  }

  ngOnDestroy(): void {
    this.serverChangeSubscription?.unsubscribe();
  }

  protected loadNodeStats(server: string | undefined): void {
    if (server) {
      this.loading = true;
      this.api.getNodeStats(server).subscribe({
        next: (result) => {
          const keys = Object.getOwnPropertyNames(result)
          this.stats = keys.map<CtmNodeBasicInfo>((key) => {
            return {
              node: key,
              activeCount: result[key].activeCount,
              active: result[key].active,
              disabled: result[key].disabled,
              disabledCount: result[key].disabledCount,
            }
          });
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
