import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, InjectionToken } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormsCoreModule } from '@ng-dynamic-forms/core';
import {
  AlertModule,
  BsDropdownModule,
  CollapseModule,
  ModalModule,
  PopoverModule,
  TabsModule,
  TooltipModule,
  TypeaheadModule
} from 'ngx-bootstrap';
import { TagInputModule } from 'ngx-chips';
import { StoreModule } from '@ngrx/store';
// import { EffectsModule } from '@ngrx/effects';
import { TourNgxBootstrapModule } from 'ngx-tour-ngx-bootstrap';
import { Restangular, RestangularModule } from 'ngx-restangular';
import { NotificationModule } from 'patternfly-ng';

import { CoreModule } from './core';
import { appConfigInitializer, ConfigService } from './config.service';
import { StoreModule as LegacyStoreModule } from './store/store.module';
import { ApiModule } from './api';
import { platformReducer, SYNDESIS_GUARDS } from './platform';
import { AppComponent } from './app.component';

export function restangularProviderConfigurer(
  restangularProvider: any,
  config: ConfigService
) {
  restangularProvider.setPlainByDefault(true);
  restangularProvider.setBaseUrl(config.getSettings().apiEndpoint);

  restangularProvider.addResponseInterceptor((data: any, operation: string) => {
    if (operation === 'getList' && data && Array.isArray(data.items)) {
      const pagingData = data.items;
      if (!!pagingData.totalCount) {
        pagingData.totalCount = data.totalCount;
      } else {
        pagingData.totalCount = pagingData.length;
      }
      return pagingData;
    }
    if (!data) {
      return [];
    }
    return data;
  });
}

export const RESTANGULAR_MAPPER = new InjectionToken<Restangular>(
  'restangularMapper'
);
export function mapperRestangularProvider(
  restangular: Restangular,
  config: ConfigService
) {
  return restangular.withConfig(restangularConfigurer => {
    const mapperEndpoint = config.getSettings().mapperEndpoint;
    restangularConfigurer.setBaseUrl(
      mapperEndpoint ? mapperEndpoint : '/mapper/v1'
    );
  });
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    DynamicFormsCoreModule.forRoot(),
    BsDropdownModule.forRoot(),
    AlertModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
    TagInputModule,
    // EffectsModule.forRoot([]), // gives runtime error "Uncaught Error: StaticInjectorError[t -> e]:..."
    ApiModule.forRoot(),
    TourNgxBootstrapModule.forRoot(),
    LegacyStoreModule,
    StoreModule.forRoot(platformReducer),
    CoreModule.forRoot(),
    NotificationModule
  ],
  providers: [
    ...SYNDESIS_GUARDS,
    {
      provide: APP_INITIALIZER,
      useFactory: appConfigInitializer,
      deps: [ConfigService],
      multi: true
    },
    {
      provide: RESTANGULAR_MAPPER,
      useFactory: mapperRestangularProvider,
      deps: [Restangular, ConfigService]
    },
    ConfigService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
