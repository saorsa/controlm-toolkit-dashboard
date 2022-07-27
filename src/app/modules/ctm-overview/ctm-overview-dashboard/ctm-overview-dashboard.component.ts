import { Component, OnInit } from '@angular/core';
import { ApiService, AppService, CtmServerStats } from "../../../services";


@Component({
  selector: 'app-ctm-overview-dashboard',
  templateUrl: './ctm-overview-dashboard.component.html',
  styleUrls: ['./ctm-overview-dashboard.component.sass']
})
export class CtmOverviewDashboardComponent implements OnInit {

  stats: CtmServerStats | null = null;
  error: any = null;
  loading = false;

  constructor(
    private readonly api: ApiService,
    private readonly app: AppService,
  ) { }

  ngOnInit(): void {
    this.loadServerStats(this.app.selectedServer);
    this.app.serverChange.subscribe(server => {
      this.loadServerStats(server);
    })
  }

  protected loadServerStats(server: string | undefined): void {
    if (server) {
      this.loading = true;
      this.api.getServerStats(server).subscribe({
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
