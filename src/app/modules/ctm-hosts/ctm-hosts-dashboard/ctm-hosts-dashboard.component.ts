import {Component, OnInit} from '@angular/core';
import {ApiService, AppService, CtmNodeStat} from "../../../services";
import {CtmNodeBasicInfo} from "../../../services/model/ctm-server.model";

@Component({
  selector: 'app-ctm-hosts-dashboard',
  templateUrl: './ctm-hosts-dashboard.component.html',
  styleUrls: ['./ctm-hosts-dashboard.component.sass']
})
export class CtmHostsDashboardComponent implements OnInit {

  stats: CtmNodeStat[] | null = null;
  error: any = null;
  loading = false;

  constructor(
    private readonly api: ApiService,
    private readonly app: AppService,
  ) { }

  ngOnInit(): void {
    this.loadNodeStats(this.app.selectedServer);
    this.app.serverChange.subscribe(server => {
      this.loadNodeStats(server);
    })
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
          console.warn(result)
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