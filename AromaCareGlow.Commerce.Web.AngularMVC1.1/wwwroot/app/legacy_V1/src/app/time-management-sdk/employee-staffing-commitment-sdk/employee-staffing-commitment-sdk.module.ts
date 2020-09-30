
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeStaffingCommitmentSdkService } from './employee-staffing-commitment-sdk.service';
import { EmployeeStaffingCommitmentSdkConfig } from './employee-staffing-commitment-sdk.config';
import { TimeManagementDomainModule } from 'src/app/time-management-domain/time-management-domain.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TimeManagementDomainModule
  ],
  providers: [
    EmployeeStaffingCommitmentSdkService,
    EmployeeStaffingCommitmentSdkConfig
  ]
})
export class EmployeeStaffingCommitmentSdkModule { }
