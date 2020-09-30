import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TimeManagementDomainModule } from '../../time-management-domain/time-management-domain.module';
import { TransactionRequestSdkService } from './transaction-request-sdk.service';
import { TransactionRequestSdkConfig } from './transaction-request-sdk.config';

@NgModule({
    imports: [
        CommonModule,
        TimeManagementDomainModule
    ],
    providers: [
        TransactionRequestSdkService,
        TransactionRequestSdkConfig
    ]
})
export class TransactionRequestModule {
}
