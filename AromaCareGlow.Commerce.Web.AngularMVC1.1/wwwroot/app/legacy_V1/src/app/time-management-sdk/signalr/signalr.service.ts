import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { NGXLogger } from 'ngx-logger';
import { TranslateService } from '@ngx-translate/core';
import { SignalrConnectionStates } from './connection-states';
import { EnvironmentService } from 'src/app/environment/environment.service';
import { SignalrConfig } from './signalr.config';

declare var $: any;
@Injectable()
export class SignalrService {
  public connectionCompleted = new BehaviorSubject<boolean>(false);
  private events: Array<Subject<any>> = [];
  private hubProxy;
  private connection;
  private configuration;
  public connectionChanged: BehaviorSubject<Number>;

  constructor(
    private logger: NGXLogger,
    private envService: EnvironmentService,
    private translateService: TranslateService,
    private config: SignalrConfig
    ) {
    this.connectionChanged = new BehaviorSubject<Number>(SignalrConnectionStates.disconnected);
  }

  public configure() {
    const connectionUrl = this.envService.baseApiPath + this.config.ENDPOINT;
    const useJsonp = this.envService.isLocal;
    this.connection = $.hubConnection(connectionUrl);
    this.hubProxy = this.connection.createHubProxy(this.config.HUB);
    this.configuration = { jsonp: useJsonp };
  }

  public registerEvent(eventName: string) {
    this.events[eventName] = new Subject<any>();
    this.subscribe(eventName);
  }

  public startConnection() {
    this.connection.start(this.configuration).done(() => {

      this.translateService.get('signalr-connection-id').subscribe((connectionIdMessage) => {
        this.logger.info(connectionIdMessage + this.connection.id);
      });

      this.connectionCompleted.next(true);
      this.registerConnectionEvents();
    });
  }

  public stopConnection() {
    this.connection.stop();
  }

  public triggerEvent(methodName: String, args: Array<any>) {
    this.hubProxy.invoke(methodName, ...args);
  }

  public onEvent(eventName: string): Subject<any> {
    return this.events[eventName];
  }

  private subscribe(eventName: string) {
    this.hubProxy.on(eventName, (data: any) => {
      this.events[eventName].next(data);
    });
  }

  private registerConnectionEvents() {
    this.connection.stateChanged((change) => {
      if (change.newState === $.signalR.connectionState.disconnected && change.oldState === $.signalR.connectionState.reconnecting) {
        this.connectionChanged.next(SignalrConnectionStates.connection_lost);
      } else {
        this.connectionChanged.next(change.newState);
      }
    });
  }
}
