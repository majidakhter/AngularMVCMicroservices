import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthlyCalendarViewComponent } from './monthly-calendar-view.component';
import { MonthlyCalendarViewWarningsModalModule } from './monthly-calendar-view-warnings/monthly-calendar-view-warnings-modal.module';
import { SharedModule } from '../../../../../../src/app/shared/shared.module';
import { CalendarDateFormatter, CalendarModule, CalendarMomentDateFormatter, DateAdapter, MOMENT } from 'angular-calendar';
import * as moment from 'moment';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ModalModule } from '@wfm/modal';
import { EventDetailsModule } from '@api-wfm/ng-sympl-ux';
import { OpenCurrentSelfScheduleModalComponent } from './open-current-self-schedule-modal/open-current-self-schedule-modal.component';

export function momentAdapterFactory() {
  return adapterFactory(moment);
}

@NgModule({
  declarations: [
    MonthlyCalendarViewComponent,
    OpenCurrentSelfScheduleModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MonthlyCalendarViewWarningsModalModule,
    ModalModule,
    FormsModule,
    EventDetailsModule.forChild(TranslateService),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: momentAdapterFactory
    },
      {
        dateFormatter: {
          provide: CalendarDateFormatter,
          useClass: CalendarMomentDateFormatter
        }
      }),
    TranslateModule
  ],
  exports: [
    MonthlyCalendarViewComponent
  ],
  providers: [
    {
      provide: MOMENT,
      useValue: moment
    }
  ]
})

export class MonthlyCalendarViewModule { }
