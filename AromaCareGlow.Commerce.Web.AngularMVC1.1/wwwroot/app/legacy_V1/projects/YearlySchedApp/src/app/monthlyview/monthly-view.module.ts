import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthlyViewComponent } from './monthly-view.component';
import { DailyScheduleComponent } from './daily-schedule/daily-schedule.component';
import { DailyScheduleSummaryComponent } from './daily-schedule-summary/daily-schedule-summary.component';
import { ModalModule } from '@wfm/modal';
import { SearchListModule } from '../../../../../src/app/shared/auto-complete/search-list.module';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../../src/app/shared/shared.module';
import { ValidationWarningsModule } from '../../../../../src/app/shared/validation-warnings/validation-warnings.module';
import { EmployeeSdkModule } from '../../../../../src/app/time-management-sdk/employee-sdk/employee-sdk.module';
import { EmployeeScheduleSdkModule } from '../../../../../src/app/time-management-sdk/employee-schedule-sdk/employee-schedule-sdk.module';
import { OrganizationSdkModule } from '../../../../../src/app/time-management-sdk/organization-sdk/organization-sdk.module';
import { ScheduleSdkModule } from '../../../../../src/app/time-management-sdk/schedule-sdk/schedule-sdk.module';
import { EmployeeOrganizationSdkModule } from '../../../../../src/app/time-management-sdk/employee-organization-sdk/employee-organization-sdk.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DayBarComponentModule } from './trade-summary/day-bar/day-bar.module';
import { QuickViewScheduleTradeModule } from './trade-summary/quick-view-schedule-trade/quick-view-schedule-trade.module';
import { QuickViewScheduleComponentModule } from './quick-view-schedule/quick-view-schedule.module';
import { TradeSummaryComponent } from './trade-summary/trade-summary.component';
import { TradeDetailsComponent } from './trade-summary/trade-details/trade-details.component';
import { MonthlyCalendarViewModule } from './monthly-calendar-view/monthly-calendar-view.module';
import { TransactionRequestModule } from '../../../../../src/app/time-management-sdk/transaction-request-sdk/transaction-request-sdk.module';
import { TradeValidationWarningsModalModule } from './trade-summary/trade-override-validation/trade-validation-warnings-modal.module';
import { QuickViewOpenShiftModule } from './quick-view-open-shift/quick-view-open-shift.module';
import { QuickViewValidationWarningsModalModule } from './quick-view-schedule/quick-view-validation-warnings-modal/quick-view-validation-warnings-modal.module';
import { WfmPopoverModule } from 'src/app/shared/popover/popover.module';
import { TradeOrganizationUnitsComponent } from './trade-summary/trade-organization-units/trade-organization-units.component';
import { MatTabsModule } from '@angular/material';
import { ScheduleValidationWarningsModalModule } from 'src/app/shared/schedule-override-validation/schedule-validation-warnings-modal.module';
import { NavigationServiceModule } from 'src/app/time-management-sdk/navigationServices/navigation-service.module';

@NgModule({
  declarations: [
    MonthlyViewComponent,
    DailyScheduleComponent,
    DailyScheduleSummaryComponent,
    TradeSummaryComponent,
    TradeDetailsComponent,
    TradeOrganizationUnitsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    EmployeeScheduleSdkModule,
    OrganizationSdkModule,
    EmployeeSdkModule,
    EmployeeOrganizationSdkModule,
    ScheduleSdkModule,
    TransactionRequestModule,
    ScheduleValidationWarningsModalModule,
    ModalModule,
    SearchListModule.forChild(TranslateService),
    TranslateModule,
    FormsModule,
    ValidationWarningsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    QuickViewScheduleComponentModule,
    QuickViewOpenShiftModule,
    DayBarComponentModule,
    QuickViewScheduleTradeModule,
    MonthlyCalendarViewModule,
    TradeValidationWarningsModalModule,
    QuickViewValidationWarningsModalModule,
    WfmPopoverModule,
    MatTabsModule,
    NavigationServiceModule
  ],
  exports: [
    MonthlyViewComponent
  ],
  entryComponents: [TradeOrganizationUnitsComponent]
})

export class MonthlyViewModule { }
