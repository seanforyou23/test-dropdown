import { Component, OnInit } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
// import { Notification, NotificationEvent, NotificationType } from 'patternfly-ng';
// import { NotificationService } from '@syndesis/ui/common/ui-patternfly/notification-service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';
  isDisabled = false;
  // notifications: Observable<Notification[]>;
  // showClose: boolean;

  // constructor(private notificationService: NotificationService) {} // causes runtime error!
  constructor() {}

  ngOnInit() {
    // this.notifications = this.notificationService.getNotificationsObservable();
    // this.showClose = true;

    // this.notificationService.message(
    //   NotificationType.SUCCESS,
    //   'Example header',
    //   'Open js console to see notifications observer in action',
    //   false,
    //   null,
    //   null
    // );

  }

  // handleAction($event: NotificationEvent): void {
  //   if ($event.action.id === 'reload') {
  //     location.reload();
  //   }
  // }

  // handleClose($event: NotificationEvent): void {
  //   this.notificationService.remove($event.notification);
  // }
}

