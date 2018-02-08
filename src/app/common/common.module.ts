import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NotificationModule } from 'patternfly-ng';
import { TagInputModule } from 'ngx-chips';

import { CancelConfirmationModalComponent } from './cancel_confirmation_modal';
import { DeleteConfirmationModalComponent } from './delete_confirmation_modal';
import { SYNDESYS_EDITABLE_DIRECTIVES } from './editable';
import { LoadingComponent } from './loading/loading.component';
import { SYNDESYS_VALIDATION_DIRECTIVES } from './validation';
import { WizardProgressBarComponent } from './wizard_progress_bar';

import { DerpPipe } from './derp.pipe';
import { ObjectPropertyFilterPipe } from './object-property-filter.pipe';
import { ObjectPropertySortPipe } from './object-property-sort.pipe';
import { TruncateCharactersPipe } from './truncate-characters.pipe';
import { TruncateWordsPipe } from './truncate-words.pipe';
import { CapitalizePipe } from './capitalize.pipe';
import { TitleizePipe } from './titleize.pipe';
import { SlugifyPipe } from './slugify.pipe';
import { IconPathPipe } from './icon-path.pipe';
import { ParseMarkdownLinksPipe } from './parse-markdown-links.pipe';
import { ButtonComponent } from './button.component';

// TODO: Move these services out to a CoreModule
import { NotificationService } from './ui-patternfly';
import { ModalComponent, ModalService } from './modal';
import { ConfigService } from '../config.service';
import { NavigationService } from './navigation.service';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule, FormsModule,
    TagInputModule,
    RouterModule
  ],
  declarations: [
    DerpPipe,
    ObjectPropertyFilterPipe,
    ObjectPropertySortPipe,
    TruncateCharactersPipe,
    TruncateWordsPipe,
    LoadingComponent,
    CapitalizePipe,
    TitleizePipe,
    ButtonComponent,
    SlugifyPipe,
    IconPathPipe,
    ParseMarkdownLinksPipe,
    ModalComponent,
    WizardProgressBarComponent,
    CancelConfirmationModalComponent,
    DeleteConfirmationModalComponent,
    ...SYNDESYS_EDITABLE_DIRECTIVES,
    ...SYNDESYS_VALIDATION_DIRECTIVES
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule, FormsModule,
    DerpPipe,
    ObjectPropertyFilterPipe,
    ObjectPropertySortPipe,
    TruncateCharactersPipe,
    TruncateWordsPipe,
    LoadingComponent,
    CapitalizePipe,
    TitleizePipe,
    ParseMarkdownLinksPipe,
    ButtonComponent,
    SlugifyPipe,
    IconPathPipe,
    ModalComponent,
    WizardProgressBarComponent,
    CancelConfirmationModalComponent,
    DeleteConfirmationModalComponent,
    ...SYNDESYS_EDITABLE_DIRECTIVES,
    ...SYNDESYS_VALIDATION_DIRECTIVES
  ]
})
export class SyndesisCommonModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SyndesisCommonModule,
      providers: [
        ConfigService,
        ModalService,
        NotificationService,
        NavigationService
      ]
    };
  }
}
