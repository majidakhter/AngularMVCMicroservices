
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { EnvironmentService } from '../../environment/environment.service';
import { DateFormatter } from 'src/app/shared/date-formats/date-formatter';
import { EmployeeStaffingCommitmentSdkConfig } from './employee-staffing-commitment-sdk.config';
import { HttpClient } from '@angular/common/http';
import { IEmployeeStaffingCommitmentResponse } from './employee-staffing-commitment-response';

@Injectable()
export class EmployeeStaffingCommitmentSdkService {

  constructor(
    private http: HttpClient,
    private envService: EnvironmentService,
    private employeeStaffingCommitmentSdkConfig: EmployeeStaffingCommitmentSdkConfig,
    private dateFormatter: DateFormatter
    
  ) { }  

  public getStaffingCommitmentsForSchedulePeriod(employeeCode, startDate, endDate, schedulePeriodStage, hoursCommitment, shiftsCommitment): Observable<IEmployeeStaffingCommitmentResponse> {
    const uri = this.envService.baseApiPath + this.employeeStaffingCommitmentSdkConfig.APPROVED_HOURS_STAFF_COMMITMENT_URL.replace('{employeeCode}', employeeCode)
      .replace('{startDate}', this.dateFormatter.toUrlDate(startDate))
      .replace('{endDate}', this.dateFormatter.toUrlDate(endDate))
      .replace('{periodStage}', schedulePeriodStage)
      .replace('{hoursCommitment}', hoursCommitment)
      .replace('{shiftsCommitment}', shiftsCommitment);
    return this.http.get<IEmployeeStaffingCommitmentResponse>(uri).map(result => result);
  }
}
