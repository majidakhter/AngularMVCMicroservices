import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeOrganizationSdkService } from './employee-organization-sdk.service';
import { TimeManagementDomainModule } from '../../time-management-domain/time-management-domain.module';

@NgModule({
    imports: [
        CommonModule,
        TimeManagementDomainModule
    ],
    providers: [
        [EmployeeOrganizationSdkService]
    ]
})
export class EmployeeOrganizationSdkModule {
}
