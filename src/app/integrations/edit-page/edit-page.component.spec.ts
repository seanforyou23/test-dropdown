import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBackend } from '@angular/http/testing';
import { RequestOptions, BaseRequestOptions, Http } from '@angular/http';
import { RestangularModule } from 'ngx-restangular';
import { ToolbarModule } from 'patternfly-ng';

import { SyndesisCommonModule, NavigationService } from '@syndesis/ui/common';
import { CurrentFlow, FlowViewComponent, FlowViewStepComponent, IntegrationsEditPage } from '@syndesis/ui/integrations/edit-page';
import { ConnectionsListComponent } from '../../connections/list/list.component';
import { StoreModule } from '@syndesis/ui/store';

import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule, PopoverModule } from 'ngx-bootstrap';

describe('IntegrationsEditComponent', () => {
  let component: IntegrationsEditPage;
  let fixture: ComponentFixture<IntegrationsEditPage>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          CollapseModule,
          CommonModule,
          FormsModule,
          SyndesisCommonModule,
          ModalModule,
          RestangularModule.forRoot(),
          RouterTestingModule.withRoutes([]),
          PopoverModule.forRoot(),
          CollapseModule.forRoot(),
          StoreModule,
          ToolbarModule
        ],
        declarations: [
          IntegrationsEditPage,
          ConnectionsListComponent,
          FlowViewComponent,
          FlowViewStepComponent
        ],
        providers: [
          MockBackend,
          {
            provide: RequestOptions,
            useClass: BaseRequestOptions
          },
          {
            provide: Http,
            useFactory: (backend, options) => {
              return new Http(backend, options);
            },
            deps: [MockBackend, RequestOptions]
          },
          NavigationService,
          CurrentFlow
        ]
      }).compileComponents();
    })
  );

  // TODO: Add separate test for editing
  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationsEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
