import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OrganizationSdkService } from './organization-sdk.service';
import { TimeManagementDomainModule } from '../../time-management-domain/time-management-domain.module';

@NgModule({
    imports: [
        CommonModule,
        TimeManagementDomainModule
    ],
    providers: [
        [OrganizationSdkService]
    ]
})
export class OrganizationSdkModule {
}
