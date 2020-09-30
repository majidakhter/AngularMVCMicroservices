
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SelfScheduleComponent } from './self-schedule.component';
import { ModalModule } from '@wfm/modal';
import { SelfSchedulePeriodComponent } from './self-schedule-period/self-schedule-period.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScheduleSdkModule } from 'src/app/time-management-sdk/schedule-sdk/schedule-sdk.module';
import { ValidationWarningsModule } from 'src/app/shared/validation-warnings/validation-warnings.module';
import { EmployeeScheduleSdkModule } from 'src/app/time-management-sdk/employee-schedule-sdk/employee-schedule-sdk.module';
import { SelfScheduleDetailsComponent } from './self-schedule-details/self-schedule-details.component';
import { QuickViewScheduleComponent } from './quick-view-schedule/quick-view-schedule.component';
import { SelfSchedulePreferenceComponent } from './self-schedule-preference/self-schedule-preference.component';
import { SuccessValidationModalComponent } from './self-schedule-period/success-validation-modal/success-validation-modal.component';
import { TabViewModule } from 'primeng/tabview';
import { NeedsValidationModalComponent } from './self-schedule-period/needs-validation-modal/needs-validation-modal.component';
import { DropdownModule } from 'primeng/dropdown';
import { SelfScheduleCommitmentsComponent } from './self-schedule-period/self-schedule-commitments/self-schedule-commitments.component';
import { EventDetailsModule } from '@api-wfm/ng-sympl-ux';
import { EmployeeStaffingCommitmentSdkService } from 'src/app/time-management-sdk/employee-staffing-commitment-sdk/employee-staffing-commitment-sdk.service';
import { EmployeeStaffingCommitmentSdkConfig } from 'src/app/time-management-sdk/employee-staffing-commitment-sdk/employee-staffing-commitment-sdk.config';
import { SignalrConfig } from 'src/app/time-management-sdk/signalr/signalr.config';
import { CheckboxModule } from 'primeng/checkbox';
import { SelfScheduleHeaderComponent } from './self-schedule-period/self-schedule-header/self-schedule-header.component';
@NgModule({
  declarations: [SelfScheduleComponent,
    SelfSchedulePeriodComponent,
    SelfScheduleDetailsComponent,
    QuickViewScheduleComponent,
    SelfSchedulePreferenceComponent,
    SuccessValidationModalComponent,
    NeedsValidationModalComponent,
    SelfScheduleCommitmentsComponent,
    SelfScheduleHeaderComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ScheduleSdkModule,
    EmployeeScheduleSdkModule,
    ModalModule,
    TranslateModule,
    FormsModule,
    ValidationWarningsModule,
    BrowserAnimationsModule,
    TabViewModule,    
    EventDetailsModule.forChild(TranslateService),
    DropdownModule,
    CheckboxModule
  ],
  providers: [
    EmployeeStaffingCommitmentSdkService,
    EmployeeStaffingCommitmentSdkConfig,
    SignalrConfig
  ],
  exports: [
    SelfScheduleComponent
  ]
})
export class SelfScheduleModule { }
