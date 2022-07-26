import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../../services/api.service";
import {CtmServerStats} from "../../../services/model/ctm-server.model";

@Component({
  selector: 'app-ctm-overview-dashboard',
  templateUrl: './ctm-overview-dashboard.component.html',
  styleUrls: ['./ctm-overview-dashboard.component.sass']
})
export class CtmOverviewDashboardComponent implements OnInit {

  serverStats: CtmServerStats | null = null;
  error: any = null;
  loading = false;

  constructor(
    private readonly api: ApiService,
  ) { }

  ngOnInit(): void {
    
  }

  protected loadServerStats(): void {
    this.loading = true;
    this.api.getServerStats("").subscribe({
      next: (result) => {
        this.serverStats = result;
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }
}
