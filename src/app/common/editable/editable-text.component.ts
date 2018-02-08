import { Component } from '@angular/core';
import { EditableComponent } from './editable.component';

@Component({
  selector: 'syndesis-editable-text',
  template: `
    <ng-template [ngIf]="!editing">
      <em class="text-muted" *ngIf="!value">
        {{ placeholder }}
      </em>
      <ng-container *ngIf="value">
        {{ value }}
      </ng-container>
      <button type="button" class="btn btn-link" (click)="editing = true">
        <i class="fa fa-pencil" aria-hidden="true" title="Click to edit"></i>
      </button>
    </ng-template>

    <ng-template [ngIf]="editing">
      <div class="form-group" [ngClass]="{'has-error': errorMessage}">
        <input #textInput type="text" class="form-control" [ngModel]="value">
        <span class="help-block" *ngIf="errorMessage">{{ errorMessage }}</span>
      </div>
      <button type="button" class="btn btn-primary" (click)="submit(textInput.value.trim())">Save</button>
      <button type="button" class="btn btn-default" (click)="cancel()">Cancel</button>
    </ng-template>
  `,
  styles: [`
    .form-control {
      font-size: inherit;
      height: inherit;
      line-height: inherit;
    }
  `]
})
export class EditableTextComponent extends EditableComponent { }
