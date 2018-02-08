import { Component, OnInit, ViewChild } from '@angular/core';
import { OAuthAppStore } from '../../store/oauthApp/oauth-app.store';
import { OAuthApp, OAuthApps } from '../../model';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../config.service';
import { TourService } from 'ngx-tour-ngx-bootstrap';
import { UserService } from '@syndesis/ui/platform';

import { ObjectPropertyFilterConfig } from '../../common/object-property-filter.pipe';
import { ObjectPropertySortConfig } from '../../common/object-property-sort.pipe';

export interface OAuthAppListItem {
  expanded: boolean;
  client: OAuthApp;
}

@Component({
  selector: 'syndesis-oauth-apps',
  templateUrl: 'oauth-apps.component.html',
  styleUrls: ['./oauth-apps.component.scss']
})
export class OAuthAppsComponent implements OnInit {
  // Holds the candidate for clearing credentials
  selectedItem: OAuthAppListItem;
  // Pipe configuration
  filter: ObjectPropertyFilterConfig = {
    filter: '',
    propertyName: 'client.name'
  };
  sort: ObjectPropertySortConfig = {
    sortField: 'client.name',
    descending: false
  };
  // List configuration
  listConfig = {
    multiSelect: false,
    selectItems: false,
    showCheckbox: false
  };
  // Toolbar configuration
  toolbarConfig = {
    filterConfig: {
      fields: [
        {
          id: 'client.name',
          title: 'Name',
          placeholder: 'Filter by Name...',
          type: 'text'
        }
      ]
    },
    sortConfig: {
      fields: [
        {
          id: 'client.name',
          title: 'Name',
          sortType: 'alpha'
        }
      ],
      isAscending: true
    }
  };
  // Data
  list: Observable<OAuthApps>;
  loading: Observable<boolean>;
  isLoading = true;

  items: Array<OAuthAppListItem> = [];

  constructor(
    public store: OAuthAppStore,
    public config: ConfigService,
    public tourService: TourService,
    private userService: UserService
  ) {
    this.loading = store.loading;
    this.list = store.list;
  }

  // Handles events when the user interacts with the toolbar filter
  filterChanged($event) {
    // TODO update our pipe to handle multiple filters
    if ($event.appliedFilters.length === 0) {
      this.filter.filter = '';
    }
    $event.appliedFilters.forEach(filter => {
      this.filter.propertyName = filter.field.id;
      this.filter.filter = filter.value;
    });
  }

  // Handles events when the user interacts with the toolbar sort
  sortChanged($event) {
    this.sort.sortField = $event.field.id;
    this.sort.descending = !$event.isAscending;
  }

  // Returns whether or not this item has stored credentials
  isConfigured(item) {
    const client = item.client || {};
    return (
      client.clientId &&
      client.clientId !== '' &&
      (client.clientSecret && client.clientSecret !== '')
    );
  }

  // view initialization
  ngOnInit() {
    this.list.subscribe((apps: OAuthApps) => {
      const oldItems = this.items;
      this.items = [];
      for (const app of apps) {
        const oldApp = oldItems.find(item => {
          return item.client.id === app.id;
        });
        this.items.push({
          expanded: oldApp ? oldApp.expanded : false,
          client: app
        });
      }
    });
    this.store.loadAll();

    /**
     * If guided tour state is set to be shown (i.e. true), then show it for this page, otherwise don't.
     */
    if (this.userService.getTourState() === true) {
      this.tourService.initialize(
        [
          {
            route: 'settings',
            title: 'Get Started',
            content:
              'This series of popups acquaints you with Fuse Ignite. When you are ready to create a sample integration, ' +
              'click the help icon and select Documentation to get step-by-step instructions.',
            anchorId: 'get.started',
            placement: 'bottom'
          }
        ],
        {
          route: ''
        }
      );

      setTimeout(() => this.tourService.start());
    }
  }
}
