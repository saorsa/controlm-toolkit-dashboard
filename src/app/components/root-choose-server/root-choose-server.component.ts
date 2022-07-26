import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ApiService } from "../../services/api.service";


@Component({
  selector: 'app-root-choose-server',
  templateUrl: './root-choose-server.component.html',
  styleUrls: ['./root-choose-server.component.sass']
})
export class RootChooseServerComponent implements OnInit {

  title = 'Control-M Toolkit';

  @Input() headline: string = 'Choose a Control-M instance';
  @Input() selectedServerKey?: string;
  @Input() allowCancel = false;
  @Output() serverSelected = new EventEmitter<string>();
  @Output() dismissed = new EventEmitter();


  servers: string[] | null = null;
  error: any = null;
  loading = false;

  constructor(
    readonly api: ApiService
  ){ }

  isActiveServer(serverKey: string): boolean {
    return this.selectedServerKey === serverKey;
  }

  ngOnInit(): void {
    this.loadServers();
  }

  protected loadServers(): void {
    this.loading = true;
    this.api.getAllServerNames().subscribe({
      next: (result) => {
        this.servers = result;
        this.loading = false;
      },
      error: (error) => {
      this.error = error;
      this.loading = false;
      }
    });
  }
}
