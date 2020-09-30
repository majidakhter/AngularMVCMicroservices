

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeScheduleSdkService } from './employee-schedule-sdk.service';
import { TimeManagementDomainModule } from '../../time-management-domain/time-management-domain.module';
import { EmployeeScheduleSdkConfig } from './employee-schedule-sdk.config';

@NgModule({
  imports: [
    CommonModule,
    TimeManagementDomainModule
  ],
  providers: [
    EmployeeScheduleSdkService,
    EmployeeScheduleSdkConfig
  ]
})
export class EmployeeScheduleSdkModule {
}
