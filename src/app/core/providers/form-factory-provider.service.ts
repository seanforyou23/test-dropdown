import { Injectable } from '@angular/core';
import { ConfigurationProperty } from '@syndesis/ui/model';
import { FormFactoryService, ConfiguredConfigurationProperty } from '@syndesis/ui/platform';
import {
  DynamicFormControlModel,
  DynamicCheckboxModel,
  DynamicInputModel,
  DynamicTextAreaModel,
  DynamicSelectModel
} from '@ng-dynamic-forms/core';

@Injectable()
export class FormFactoryProviderService extends FormFactoryService {
  constructor() {
    super();
  }

  createFormModel(
    properties:
      | Map<string, ConfiguredConfigurationProperty>
      | Map<string, ConfigurationProperty>
      | Map<string, any>
      | {},
    values: any = {},
    controls: Array<string> = ['*']
  ): DynamicFormControlModel[] {
    const answer = <DynamicFormControlModel[]>[];
    for (const key in properties) {
      if (!properties.hasOwnProperty(key)) {
        continue;
      }
      const field = <ConfiguredConfigurationProperty>properties[key];
      const value = values[key];
      let formField: any;
      const validators = field.required ? { required: null } : {};
      const errorMessages = field.required
        ? { required: '{{label}} is required' }
        : {};
      let type = (field.type || '').toLowerCase();
      // first normalize the type
      switch (type) {
        case 'boolean':
          type = 'checkbox';
          break;
        case 'number':
        case 'integer':
        case 'long':
          type = 'number';
          break;
        case 'password':
        case 'textarea':
        case 'hidden':
          break;
        default:
          type = field.enum && field.enum.length ? 'select' : 'text';
          break;
      }
      // then use the appropriate ng2 dynamic forms constructor
      if (type === 'checkbox') {
        formField = new DynamicCheckboxModel(
          {
            id: key,
            label: field.displayName || key,
            hint: field.description,
            value: value || field.value || field.defaultValue
          },
          {
            element: {
              control: 'element-control checkbox'
            },
            grid: {
              control: 'col-sm-offset-3 col-sm-9',
              label: ''
            }
          }
        );
      } else if (type === 'textarea') {
        formField = new DynamicTextAreaModel(
          {
            id: key,
            label: field.displayName || key,
            value: value || field.value || field.defaultValue,
            hint: field.description,
            required: field.required,
            rows: field.rows,
            cols: field.cols,
            validators: validators,
            errorMessages: errorMessages
          },
          {
            element: {
              label: 'control-label'
            },
            grid: {
              control: 'col-sm-9',
              label: 'col-sm-3'
            }
          }
        );
      } else if (type === 'select') {
        formField = new DynamicSelectModel(
          {
            id: key,
            multiple: false,
            label: field.displayName || key,
            value: value || field.defaultValue || field.enum[0].value,
            hint: field.description,
            required: field.required,
            validators: validators,
            errorMessages: errorMessages,
            options: field.enum
          },
          {
            element: {
              label: 'control-label'
            },
            grid: {
              control: 'col-sm-9',
              label: 'col-sm-3'
            }
          }
        );
      } else {
        if (field.secret) {
          type = 'password';
        }
        formField = new DynamicInputModel(
          {
            id: key,
            label: type === 'hidden' ? null : field.displayName || key,
            inputType: type,
            value: value || field.value || field.defaultValue,
            hint: field.description,
            list: field.enum
              ? (<Array<any>>field.enum).map(val => {
                  if (typeof val === 'string') {
                    return val;
                  }
                  return val['value'];
                })
              : undefined,
            required: type === 'hidden' ? undefined : field.required,
            validators: type === 'hidden' ? undefined : validators,
            errorMessages: errorMessages
          },
          {
            element: {
              label: 'control-label'
            },
            grid: {
              control: 'col-sm-9',
              label: 'col-sm-3'
            }
          }
        );
      }

      if (formField) {
        answer.push(formField);
      }
    }
    // guard against missing wildcard
    if (controls.find(val => val === '*') === undefined) {
      controls.push('*');
    }
    // sort the form based on the controls array
    const wildcardIndex = controls.findIndex(val => val === '*');
    answer.sort((a, b) => {
      let aIndex = controls.findIndex(val => val === a.id);
      if (aIndex === -1) {
        aIndex = wildcardIndex;
      }
      let bIndex = controls.findIndex(val => val === b.id);
      if (bIndex === -1) {
        bIndex = wildcardIndex;
      }
      return aIndex - bIndex;
    });
    return answer;
  }
}
