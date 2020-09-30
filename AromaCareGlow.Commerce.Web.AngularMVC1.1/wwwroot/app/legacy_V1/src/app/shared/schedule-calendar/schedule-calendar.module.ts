

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from '@wfm/tooltip';
import { DateFormatModule } from '../date-formats/date-format.module';
import { ScheduleSdkModule } from '../../time-management-sdk/schedule-sdk/schedule-sdk.module';

@NgModule({
    imports: [
        CommonModule,
        DateFormatModule,
        TranslateModule,
        TooltipModule,
        ScheduleSdkModule
    ],
    declarations: [],
    exports: []
})
export class ScheduleCalendarModule { }
