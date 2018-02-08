import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { NavigationService } from '../../common/navigation.service';
import { CurrentConnectionService, ConnectionEvent } from './current-connection';
import { Connection, TypeFactory } from '../../model';
import { log, getCategory } from '../../logging';

const category = getCategory('Connections');

@Component({
  selector: 'syndesis-connection-create-page',
  templateUrl: 'create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class ConnectionsCreatePage implements OnInit, OnDestroy {
  constructor(
    public current: CurrentConnectionService,
    private route: ActivatedRoute,
    private router: Router,
    private nav: NavigationService
  ) {}

  get connection(): Connection {
    return this.current.connection;
  }

  getCurrentPage() {
    const child = this.route.firstChild;
    if (child && child.snapshot) {
      const path = child.snapshot.url;
      return path[0].path;
    } else {
      return undefined;
    }
  }

  canContinue() {
    const page = this.getCurrentPage();
    const connection = this.current.connection;
    switch (page) {
      case 'connection-basics':
        return this.connection.name && this.connection.connector;
      case 'configure-fields':
        return this.current.formGroup && this.current.formGroup.valid;
      case 'review':
      // TODO is this ever going to be false?
      default:
        return true;
    }
  }

  showBack() {
    const page = this.getCurrentPage();
    switch (page) {
      case 'connection-basics':
        return false;
      default:
        return true;
    }
  }

  showNextButton() {
    const page = this.getCurrentPage();
    switch (page) {
      case 'connection-basics':
        return false;
      case 'configure-fields':
        return !this.current.hasCredentials();
      case 'review':
        return false;
      default:
        return true;
    }
  }

  cancel() {
    this.router.navigate(['cancel'], { relativeTo: this.route });
  }

  goBack() {
    const page = this.getCurrentPage();
    const target = [];
    switch (page) {
      case 'connection-basics':
        target.push('..');
        break;
      case 'configure-fields':
        target.push('connection-basics');
        break;
      case 'review':
        if (
          !this.current.connection.connector.properties ||
          this.current.connection.connector.properties === ''
        ) {
          target.push('connection-basics');
        } else {
          target.push('configure-fields');
        }
        break;
      default:
        break;
    }
    if (target.length) {
      this.router.navigate(target, { relativeTo: this.route });
    }
  }

  /**
   *  TODO this is terrible, the page flow should be handled in the individual steps
   */
  goForward() {
    const page = this.getCurrentPage();
    const target = [];
    switch (page) {
      case 'connection-basics':
        if (
          !this.current.connection.connector.properties ||
          this.current.connection.connector.properties === ''
        ) {
          target.push('review');
        } else {
          target.push('configure-fields');
        }
        break;
      case 'configure-fields':
        target.push('review');
        break;
      default:
        break;
    }
    if (target.length) {
      this.router.navigate(target, { relativeTo: this.route });
    }
  }

  doCreate() {
    this.current.events.emit({
      kind: 'connection-trigger-create'
    });
  }

  handleEvent(event: ConnectionEvent) {
    const page = this.getCurrentPage();
    switch (event.kind) {
      case 'connection-set-connection':
        log.infoc(
          () => 'Credentials: ' + JSON.stringify(this.current.credentials)
        );
        log.infoc(() => 'hasCredentials: ' + this.current.hasCredentials());
        if (!this.current.hasConnector() && page !== 'connection-basics') {
          setTimeout(() => {
            this.router.navigate(['connection-basics'], {
              relativeTo: this.route
            });
          }, 10);
          return;
        } else if (
          this.current.hasConnector() &&
          page === 'connection-basics'
        ) {
          this.goForward();
        }
        if (
          this.current.oauthStatus &&
          this.current.oauthStatus.status === 'SUCCESS' &&
          page === 'configure-fields'
        ) {
          this.goForward();
          return;
        }
        break;
      default:
        break;
    }
  }

  ngOnInit() {
    this.current.init();
    this.current.events.subscribe(event => {
      this.handleEvent(event);
    });
    this.route.fragment.subscribe(fragment => {
      /**
       * Detect if there's a selected connection ID already or not
       */
      if (this.current.connection && this.current.connection.connectorId) {
        return;
      }
      const connection = TypeFactory.createConnection();
      if (fragment) {
        const status = JSON.parse(decodeURIComponent(fragment));
        this.current.oauthStatus = status;
        connection.connectorId = status.connectorId;
      }
      this.current.connection = connection;
    });
    this.nav.hide();
  }

  ngOnDestroy() {
    this.current.dispose();
    this.nav.show();
  }
}
