import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBackend } from '@angular/http/testing';
import { RequestOptions, BaseRequestOptions, Http } from '@angular/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsModule, CollapseModule, PopoverModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';

import { RestangularModule } from 'ngx-restangular';

import { FlowViewComponent } from './flow-view.component';
import { FlowViewStepComponent } from './flow-view-step.component';
import { IntegrationStore } from '../../../store/integration/integration.store';
import { IntegrationService } from '../../../store/integration/integration.service';
import { CurrentFlow } from '../current-flow.service';
import { SyndesisCommonModule } from '../../../common/common.module';
import { ConnectionsModule } from '../../../connections/connections.module';
import { EventsService } from '../../../store/entity/events.service';
import { TourService } from 'ngx-tour-ngx-bootstrap';

describe('IntegrationsCreateComponent', () => {
  let component: FlowViewComponent;
  let fixture: ComponentFixture<FlowViewComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          FormsModule,
          RouterTestingModule.withRoutes([]),
          RestangularModule.forRoot(),
          ConnectionsModule,
          ModalModule,
          TabsModule.forRoot(),
          PopoverModule.forRoot(),
          CollapseModule.forRoot(),
          SyndesisCommonModule.forRoot(),
          CollapseModule
        ],
        declarations: [FlowViewComponent, FlowViewStepComponent],
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
          CurrentFlow,
          IntegrationStore,
          IntegrationService,
          EventsService,
          TourService
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
