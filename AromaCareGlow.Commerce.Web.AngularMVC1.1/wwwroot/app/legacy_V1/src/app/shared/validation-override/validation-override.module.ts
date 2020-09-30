

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationOverrideComponent } from './validation-override.component';
import { ValidationWarningsModule } from '../validation-warnings/validation-warnings.module';

@NgModule({
  declarations: [
    ValidationOverrideComponent
  ],
  imports: [
    CommonModule,
    ValidationWarningsModule
  ],
  exports: [
    ValidationOverrideComponent
  ]
})
export class ValidationOverrideModule { }
