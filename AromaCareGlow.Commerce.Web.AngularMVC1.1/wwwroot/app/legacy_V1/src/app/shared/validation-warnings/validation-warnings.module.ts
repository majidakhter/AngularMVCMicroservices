
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorValidationWarningsComponent } from './error-validation-warnings.component';
import { EmployeeValidationWarningsComponent } from './employee-validation/employee-validation-warnings.component';

@NgModule({
  imports: [CommonModule, TranslateModule],
  declarations: [ErrorValidationWarningsComponent, EmployeeValidationWarningsComponent],
  exports: [ErrorValidationWarningsComponent, EmployeeValidationWarningsComponent],
  entryComponents: [ErrorValidationWarningsComponent, EmployeeValidationWarningsComponent]
})

export class ValidationWarningsModule {
}
