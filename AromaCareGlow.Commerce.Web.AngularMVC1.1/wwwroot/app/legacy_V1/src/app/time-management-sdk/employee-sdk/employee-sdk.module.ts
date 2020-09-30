
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeSdkService } from './employee-sdk.service';
import { TimeManagementDomainModule } from '../../time-management-domain/time-management-domain.module';
import { EmployeeSdkConfig } from './employee-sdk.config';

@NgModule({
  imports: [
    CommonModule,
    TimeManagementDomainModule
  ],
  providers: [
    EmployeeSdkService,
    EmployeeSdkConfig
  ]
})
export class EmployeeSdkModule { }
