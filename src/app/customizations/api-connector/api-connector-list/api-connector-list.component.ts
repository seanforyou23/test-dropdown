import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActionConfig, ListConfig, EmptyStateConfig } from 'patternfly-ng';

import { ModalService } from '@syndesis/ui/common';
import { log, getCategory } from '@syndesis/ui/logging';
import { ConfigService } from '@syndesis/ui/config.service';
import {
  ApiConnectorData, ApiConnectors, ApiConnectorState,
  ApiConnectorStore, getApiConnectorState,
  ApiConnectorActions
} from '@syndesis/ui/customizations/api-connector';

@Component({
  selector: 'syndesis-api-connector-list',
  templateUrl: './api-connector-list.component.html',
  styleUrls: ['./api-connector-list.component.scss']
})
export class ApiConnectorListComponent implements OnInit, OnDestroy {
  @ViewChild('confirmDeleteModalTemplate') confirmDeleteModalTemplate: TemplateRef<any>;
  apiConnectorState$: Observable<ApiConnectorState>;
  filteredApiConnectors$ = new BehaviorSubject(<ApiConnectors>{});
  listConfig: ListConfig;
  appName: string;
  itemUseMapping: { [valueComparator: string]: string } = {
    '=1': '<strong>1</strong> time',
    'other': '<strong>#</strong> times'
  };

  private confirmDeleteModalId = 'confirm-delete-modal';

  get apiConnectors$(): Observable<ApiConnectors> {
    return this.apiConnectorState$.map(apiConnectorState => apiConnectorState.list);
  }

  get stateError(): Observable<string> {
    return this.apiConnectorState$
      .filter(apiConnectorState => apiConnectorState.hasErrors)
      .map(apiConnectorState => apiConnectorState.errors[0].message);
  }

  constructor(
    private apiConnectorStore: Store<ApiConnectorStore>,
    private config: ConfigService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: ModalService,
  ) {
    this.listConfig = {
      dblClick: false,
      multiSelect: false,
      selectItems: false,
      showCheckbox: false,
      emptyStateConfig: {
        iconStyleClass: 'pficon pficon-add-circle-o',
        title: 'Create API Connector',
        info:
          'There are currently no API connectors available. Please click on the button below to create one.',
        actions: {
          primaryActions: [
            {
              id: 'createApiConnector',
              title: 'Create API Connector',
              tooltip: 'Create API Connector'
            }
          ],
          moreActions: []
        } as ActionConfig
      } as EmptyStateConfig
    };
  }

  ngOnInit() {
    this.appName = this.config.getSettings('branding', 'appName', 'Syndesis');
    this.apiConnectorState$ = this.apiConnectorStore.select<ApiConnectorState>(getApiConnectorState);
    this.modalService.registerModal(this.confirmDeleteModalId, this.confirmDeleteModalTemplate);
  }

  handleAction(event: any): void {
    if (event.id === 'createApiConnector') {
      this.router.navigate(['create', 'swagger-connector'], { relativeTo: this.route });
    }
  }

  handleClick(event: { item: ApiConnectorData }): void {
    const apiConnector = event.item;
    this.router.navigate([apiConnector.id], { relativeTo: this.route });
  }

  onDelete(id: string): void {
    this.modalService.show(this.confirmDeleteModalId).then(modal => {
      if (modal.result) {
        this.apiConnectorStore.dispatch(ApiConnectorActions.delete(id));
      }
    });
  }

  onDeleteConfirm(event): void {
    this.modalService.hide(this.confirmDeleteModalId, event);
  }

  ngOnDestroy() {
    this.modalService.unregisterModal(this.confirmDeleteModalId);
  }
}
