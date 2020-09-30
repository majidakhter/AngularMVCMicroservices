

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ValidationWarningsModule } from '../validation-warnings/validation-warnings.module';

@NgModule({
  imports: [CommonModule, TranslateModule, ValidationWarningsModule],
  declarations: [],
  exports: [],
  entryComponents: []
})

export class ScheduleValidationWarningsModalModule {
}
