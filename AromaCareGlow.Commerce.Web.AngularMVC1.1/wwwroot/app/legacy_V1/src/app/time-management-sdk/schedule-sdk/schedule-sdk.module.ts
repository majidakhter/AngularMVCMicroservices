import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleSdkService } from './schedule-sdk.service';
import { TimeManagementDomainModule } from '../../time-management-domain/time-management-domain.module';
import { ScheduleSdkConfig } from './schedule-sdk.config';
import { TransactionRequestModule } from '../transaction-request-sdk/transaction-request-sdk.module';

@NgModule({
  imports: [
    CommonModule,
    TimeManagementDomainModule,
    TransactionRequestModule
  ],
  providers: [
    ScheduleSdkService,
    ScheduleSdkConfig
  ]
})

export class ScheduleSdkModule {

}
