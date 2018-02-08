import { Injectable, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { ConnectionStore } from '../../store/connection/connection.store';
import { ConnectorStore } from '../../store/connector/connector.store';
import { Connection, Connector, Connections, Connectors } from '../../model';

import { log, getCategory } from '../../logging';

const category = getCategory('CurrentConnectionService');

export class ConnectionEvent {
  kind: string;
  [name: string]: any;
}

@Injectable()
export class CurrentConnectionService {
  events = new EventEmitter<ConnectionEvent>();

  private _loaded: boolean;
  private _connection: Connection;
  private _credentials: any;
  private _oauthStatus: any;
  private _formGroup: FormGroup;
  private subscription: Subscription;

  constructor(
    private store: ConnectionStore,
    private connectorStore: ConnectorStore
  ) {}

  init() {
    this._credentials = undefined;
    this._oauthStatus = undefined;
    this._connection = undefined;
    this._formGroup = undefined;
    this._loaded = false;
    this.subscription = this.events.subscribe((event: ConnectionEvent) =>
      this.handleEvent(event)
    );
  }

  dispose() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  handleEvent(event: ConnectionEvent) {
    log.infoc(() => 'connection event: ' + JSON.stringify(event), category);
    switch (event.kind) {
      case 'connection-check-connector':
        if (!this.fetchConnector(this._connection.connectorId)) {
          this.events.emit({
            kind: 'connection-check-credentials',
            connectorId: this._connection.connectorId
          });
        }
        break;
      case 'connection-check-credentials':
        if (!this.checkCredentials()) {
          this.events.emit({
            kind: 'connection-set-connection',
            connection: this._connection
          });
        }
        break;
      case 'connection-set-connection':
        this._loaded = true;
        break;
      // TODO not sure if these next 3 cases are needed really
      case 'connection-set-name':
        this._connection.name = event['name'];
        break;
      case 'connection-set-description':
        this._connection.description = event['description'];
        break;
      case 'connection-set-tags':
        this._connection.tags = event['tags'];
        break;
      case 'connection-save-connection':
        this.saveConnection(event);
        break;
      default:
    }
  }

  hasConnector() {
    return this.connection.connectorId !== undefined;
  }

  acquireCredentials() {
    if (!this._connection || !this._connection.connectorId) {
      this._credentials = undefined;
      return Observable.empty();
    }
    const connectorId = this._connection.connectorId;
    this.connectorStore
      .acquireCredentials(connectorId)
      .subscribe((resp: any) => {
        log.infoc(() => 'Got response: ' + JSON.stringify(resp));
      });
  }

  clearOAuthError() {
    this.oauthStatus = undefined;
  }

  hasCredentials(): boolean {
    return this._credentials && this._credentials.type !== undefined;
  }

  get oauthError(): boolean {
    return this._oauthStatus && this._oauthStatus !== 'SUCCESS';
  }

  get oauthStatus(): any {
    return this._oauthStatus;
  }

  set oauthStatus(oauthStatus: any) {
    this._oauthStatus = oauthStatus;
  }

  get loaded(): boolean {
    return this._loaded;
  }

  get credentials(): any {
    return this._credentials;
  }

  get connection(): Connection {
    return this._connection;
  }

  get formGroup(): FormGroup {
    return this._formGroup;
  }

  set formGroup(formGroup: FormGroup) {
    this._formGroup = formGroup;
  }

  set connection(connection: Connection) {
    this._loaded = false;
    this._connection = connection;
    const connectorId = connection.connectorId;
    this.events.emit({
      kind: 'connection-check-connector',
      connection: this._connection
    });
  }

  private checkCredentials() {
    const connectorId = this._connection.connectorId;
    if (!connectorId) {
      return false;
    }
    if (!this._credentials || this._credentials.connectorId !== connectorId) {
      // fetch any credentials for the connector
      const sub = this.fetchCredentials().subscribe(
        () => {
          sub.unsubscribe();
          this.events.emit({
            kind: 'connection-set-connection',
            connection: this._connection
          });
        },
        error => {
          log.infoc(
            () =>
              'Failed to fetch connector credentials: ' + JSON.stringify(error),
            category
          );
          sub.unsubscribe();
          this.events.emit({
            kind: 'connection-set-connection',
            connection: this._connection
          });
        }
      );
      return true;
    } else {
      return false;
    }
  }

  private fetchConnector(connectorId: string) {
    if (connectorId && !this._connection.connector) {
      const sub = this.connectorStore.load(connectorId).subscribe(
        connector => {
          if (!connector.id) {
            return;
          }
          this._connection.connector = connector;
          this._connection.icon = connector.icon;
          this.events.emit({
            kind: 'connection-check-credentials',
            connection: this._connection
          });
          sub.unsubscribe();
        },
        error => {
          try {
            log.infoc(
              () => 'Failed to fetch connector: ' + JSON.stringify(error),
              category
            );
          } catch (err) {
            log.infoc(() => 'Failed to fetch connector: ' + error, category);
          }
          this.events.emit({
            kind: 'connection-check-credentials',
            error: error,
            connection: this._connection
          });
          sub.unsubscribe();
        }
      );
      return true;
    }
    return false;
  }

  private fetchCredentials() {
    if (!this._connection || !this._connection.connectorId) {
      this._credentials = undefined;
      return Observable.empty();
    }
    const connectorId = this._connection.connectorId;
    return Observable.create(observer => {
      this.connectorStore.credentials(connectorId).subscribe((resp: any) => {
        // enrich the response with the connectorId
        this._credentials = { ...resp, ...{ connectorId: connectorId } };
        observer.next(this._credentials);
        observer.complete();
      });
    });
  }

  private saveConnection(event: ConnectionEvent) {
    // poor man's clone
    const connection = <Connection>JSON.parse(
      JSON.stringify(event['connection'] || this.connection)
    );
    // just in case this leaks through from the form
    for (const prop in connection.connector.properties) {
      if (!prop.hasOwnProperty(prop)) {
        continue;
      }
      // @FIXME avoid using 'delete' since it leaves memory pointers unhandled by the garbage collector
      delete connection.connector.properties[prop]['value'];
    }
    const tags = connection.tags || [];
    const connectorTag = connection.connectorId || connection.connector.id;

    if (tags.indexOf(connectorTag) === -1) {
      tags.push(connectorTag);
    }

    connection.tags = tags;
    const sub = this.store.updateOrCreate(connection).subscribe(
      (c: Connection) => {
        log.debugc(
          () => 'Saved connection: ' + JSON.stringify(c, undefined, 2),
          category
        );
        const action = event['action'];
        if (action && typeof action === 'function') {
          action(c);
        }
        sub.unsubscribe();
      },
      (reason: any) => {
        log.debugc(
          () =>
            'Error saving connection: ' + JSON.stringify(reason, undefined, 2),
          category
        );
        const errorAction = event['error'];
        if (errorAction && typeof errorAction === 'function') {
          errorAction(reason);
        }
        sub.unsubscribe();
      }
    );
  }
}
