import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { NotificationModule } from 'patternfly-ng';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BsDropdownModule.forRoot(),
    AlertModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
    NotificationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
