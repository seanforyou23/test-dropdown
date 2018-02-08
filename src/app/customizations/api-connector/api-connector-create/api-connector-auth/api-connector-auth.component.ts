import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { CustomValidators } from '@syndesis/ui/platform';
import { CustomConnectorRequest } from '@syndesis/ui/customizations/api-connector';

@Component({
  selector: 'syndesis-api-connector-auth',
  templateUrl: './api-connector-auth.component.html',
  styleUrls: ['./api-connector-auth.component.scss']
})
export class ApiConnectorAuthComponent implements OnInit, OnDestroy {
  authSetupForm: FormGroup;
  authSetupFormValueSubscription: Subscription;
  @Input() customConnectorRequest: CustomConnectorRequest;
  @Output() authSetup = new EventEmitter();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    const { authenticationType, authorizationEndpoint } = this.customConnectorRequest.properties;
    this.authSetupForm = this.formBuilder.group({
      authenticationType: [authenticationType ? authenticationType.defaultValue : ''],
      authorizationEndpoint: [authorizationEndpoint ? authorizationEndpoint.defaultValue : ''],
      tokenEndpoint: ['']
    });

    this.authSetupFormValueSubscription = this.authSetupForm
      .get('authenticationType')
      .valueChanges
      .subscribe(value => this.setOAuthFormValidation(value));

    this.setOAuthFormValidation(authenticationType ? authenticationType.defaultValue : '');
  }

  onSubmit({ value, valid }): void {
    if (valid) {
      this.authSetup.emit(value);
    }
  }

  ngOnDestroy() {
    this.authSetupFormValueSubscription.unsubscribe();
  }

  private setOAuthFormValidation(authenticationType: string) {
    const validatorFn = authenticationType == 'oauth2' ? [Validators.required, CustomValidators.validUrl] : [];
    const { authorizationEndpoint, tokenEndpoint } = this.authSetupForm.controls;

    authorizationEndpoint.setValidators(validatorFn);
    authorizationEndpoint.updateValueAndValidity();
    tokenEndpoint.setValidators(validatorFn);
    tokenEndpoint.updateValueAndValidity();
  }
}
