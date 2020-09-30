

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule as PCalendarModule } from 'primeng/components/calendar/calendar';
import { AppConfig, APP_CONFIG } from '../app.config';
import { DateFormatModule } from './date-formats/date-format.module';
import { ToastComponent } from './toast/toast.component';
import { ToastService } from './toast/toast.service';
import { DateInputComponent } from './date-input/date-input.component';
import { DateInputService } from './date-input/date-input.service';
import { DocumentRef } from './document-ref/document-ref.service';
import { TimeInputComponent } from './time-input/time-input.component';
import { LoadingPlaceholderModule } from '../shared/loading-placeholder/loading-placeholder.module';
import { ValidationOverrideComponent } from './validation-override/validation-override.component';
import { ValidationWarningsModule } from './validation-warnings/validation-warnings.module';
import { ValidationOverrideModule } from './validation-override/validation-override.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { EmployeeCalendarDisplayService } from './calendar/employee-calendar-display.service';
import { EmployeeSdkService } from '../time-management-sdk/employee-sdk/employee-sdk.service';
import { EmployeeScheduleSdkService } from '../time-management-sdk/employee-schedule-sdk/employee-schedule-sdk.service';
import { EmployeeSdkConfig } from '../time-management-sdk/employee-sdk/employee-sdk.config';
import { ScheduleCalendarModule } from './schedule-calendar/schedule-calendar.module';
import { ScheduleCalendarComponent } from './schedule-calendar/schedule-calendar.component';
import { TooltipModule, EventDetailsModule } from '@api-wfm/ng-sympl-ux';
import { MatMenuModule } from '@angular/material/menu';
import { ScheduleValidationWarningsModalComponent } from './schedule-override-validation/schedule-validation-warnings-modal.component';
import { ScheduleValidationWarningsModalModule } from './schedule-override-validation/schedule-validation-warnings-modal.module';
import { WfmPopoverModule } from './popover/popover.module';
import { IconButtonComponent } from './icon-button/icon-button.component';
import { SelfScheduleActivityChangesComponent } from './self-schedule-activity-changes/self-schedule-activity-changes.component';
import { ScrollService } from './scroll/scroll.service';
import { WindowRef } from './window-ref/window-ref.service';
import { ModalModule } from '@wfm/modal';
import { OverlapShiftModalComponent } from './schedule-calendar/overlap-shift-modal/overlap-shift-modal.component';

@NgModule({
  declarations: [
    ToastComponent,
    DateInputComponent,
    TimeInputComponent,
    ConfirmationComponent,
    ScheduleCalendarComponent,
    ScheduleValidationWarningsModalComponent,
    IconButtonComponent,
    SelfScheduleActivityChangesComponent,
    OverlapShiftModalComponent
  ],

  imports: [
    CommonModule,
    HttpClientModule,
    PCalendarModule,
    FormsModule,
    LoadingPlaceholderModule,
    ValidationOverrideModule,
    ValidationWarningsModule,
    TranslateModule,
    ScheduleCalendarModule,
    DateFormatModule,
    TooltipModule,
    MatMenuModule,
    ScheduleValidationWarningsModalModule,
    WfmPopoverModule,
	ModalModule,
    ValidationWarningsModule,
    EventDetailsModule.forChild(TranslateService)
  ],
  exports: [
    DateFormatModule,
    ToastComponent,
    DateInputComponent,
    TimeInputComponent,
    LoadingPlaceholderModule,
    ValidationOverrideComponent,
    ConfirmationComponent,
    ScheduleCalendarComponent,
    ScheduleValidationWarningsModalComponent,
    IconButtonComponent,
    EventDetailsModule
  ],
  providers: [
    { provide: APP_CONFIG, useValue: AppConfig },
    ToastService,
    DateInputService,
    DocumentRef,
    EmployeeCalendarDisplayService,
    EmployeeSdkService,
    EmployeeScheduleSdkService,
    EmployeeSdkConfig,
    ScrollService,
    WindowRef
  ],
  entryComponents: [
    SelfScheduleActivityChangesComponent
  ]
})
export class SharedModule {
}
