import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private _selectedServer?: string;
  private readonly _serverSelection = new Subject<string | undefined>();

  get selectedServer(): string | undefined {
    return this._selectedServer;
  }

  set selectedServer(server) {
    console.warn("Changing Control-M server selection", server)
    this._selectedServer = server;
    this.serverChange.next(server);
  }

  get serverChange() : Subject<string | undefined> {
    return this._serverSelection;
  }
}
