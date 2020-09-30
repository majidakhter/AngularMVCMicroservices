
import { EmployeeStaffingCommitmentSdkService } from './employee-staffing-commitment-sdk.service';
import { MockEnvService } from 'src/app/shared/test-fakes/mock-env';
import { DateFormatter } from 'src/app/shared/date-formats/date-formatter';
import { EmployeeStaffingCommitmentSdkConfig } from './employee-staffing-commitment-sdk.config';
import { Moment } from 'moment';
import * as moment from 'moment';
import { of } from 'rxjs';
import { IEmployeeStaffingCommitmentResponse } from './employee-staffing-commitment-response';

describe('EmployeeStaffingCommitmentSdkService', () => {
  const httpClientMock = jasmine.createSpyObj('HttpClient', ['get', 'post', 'expectOne', 'expectNone', 'put', 'subscribe', 'verify']);
  let employeeStaffingCommitmentSdkService: EmployeeStaffingCommitmentSdkService;
  let mockDateFormatter: jasmine.SpyObj<DateFormatter>;
  mockDateFormatter = jasmine.createSpyObj<DateFormatter>('DateFormatter', ['toShortDate', 'format', 'toIsoDate', 'toUrlDate', 'toMonthDay', 'toShortMonth']);
  let employeeCode: string;
  let startDate: Moment;
  let endDate: Moment;

  beforeEach(() => {
    employeeStaffingCommitmentSdkService = new EmployeeStaffingCommitmentSdkService(httpClientMock, MockEnvService, new EmployeeStaffingCommitmentSdkConfig(), mockDateFormatter);
    employeeCode = 'AdminVishal';
    startDate = moment('2020-02-02');
    endDate = moment('2020-02-15');
  });

  describe('#getStaffingCommitmentsForSchedulePeriod', () => {
    beforeEach(() => {
      const staffingCommitmentResult: IEmployeeStaffingCommitmentResponse = {
        'employeeCode': 'AdminVishal',
        'schedulePeriods': [
          {
            'staffConfigurationId': 104,
            'startDate': moment('2020-02-02'),
            'endDate': moment('2020-02-15'),
            'staffCommitments': [
              {
                'startDate': moment('2020-02-02'),
                'endDate': moment('2020-02-15'),
                'type': 'MinimumApprovedHoursSchedulePeriod',
                'actual': 8,
                'target': 120,
                'whenUpdated': moment('2020-01-24'),
                'unit': 'Hours',
                'schedulePeriodStage': 'SelfSchedule'
              },
              {
                'startDate': moment('2020-02-02'),
                'endDate': moment('2020-02-15'),
                'type': 'MinimumApprovedHoursSchedulePeriod',
                'actual': 8,
                'target': 120,
                'whenUpdated': moment('2020-01-24'),
                'unit': 'Hours',
                'schedulePeriodStage': 'SelfSchedule'
              }
            ]
          }],
          'pendingSchedulePeriodValidation': true
        };
        httpClientMock.get.and.returnValue(of(staffingCommitmentResult));
    });

    describe('when employee code passed in', () => {
      it('should return the minapprovedschedulehoursdata', (done) => {
        employeeStaffingCommitmentSdkService.getStaffingCommitmentsForSchedulePeriod(employeeCode, startDate, endDate, 'SelfSchedule',
        'MinimumApprovedHoursSchedulePeriod', 'MinimumWeekendSchedulesInSchedulePeriod').subscribe((res) => {
          expect(res.schedulePeriods.length).toBe(1);
          done();
        });
        const uri = (MockEnvService.baseApiPath +
          new EmployeeStaffingCommitmentSdkConfig().APPROVED_HOURS_STAFF_COMMITMENT_URL)
          .replace('{employeeCode}', employeeCode)
          .replace('{startDate}', mockDateFormatter.toUrlDate(startDate))
          .replace('{endDate}', mockDateFormatter.toUrlDate(endDate))
          .replace('{periodStage}', 'SelfSchedule')
          .replace('{commitmentType}', 'MinimumApprovedHoursSchedulePeriod')
          .replace('{commitmentType}', 'MinimumWeekendSchedulesInSchedulePeriod');
        httpClientMock.expectOne(uri);
      });
    });
  });

  describe('#getStaffingCommitmentsForSchedulePeriod', () => {
    beforeEach(() => {
      const staffingCommitmentResult: IEmployeeStaffingCommitmentResponse = {
        'employeeCode': 'AdminVishal',
        'schedulePeriods': [
          {
            'staffConfigurationId': 104,
            'startDate': moment('2020-02-02'),
            'endDate': moment('2020-02-15'),
            'staffCommitments': [
              {
                'startDate': moment('2020-02-02'),
                'endDate': moment('2020-02-15'),
                'type': 'MinimumWeekendSchedulesInSchedulePeriod',
                'actual': 0,
                'target': 1,
                'whenUpdated': moment('2020-01-24'),
                'unit': 'Shifts',
                'schedulePeriodStage': 'SelfSchedule'
            }
            ]
          }],
          'pendingSchedulePeriodValidation': true
        };
        httpClientMock.get.and.returnValue(of(staffingCommitmentResult));
    });

    describe('when employee code passed in', () => {
      it('should return the minapprovedweekendshiftsdata', (done) => {
        employeeStaffingCommitmentSdkService.getStaffingCommitmentsForSchedulePeriod(employeeCode, startDate, endDate, 'SelfSchedule',
        'MinimumApprovedHoursSchedulePeriod', 'MinimumWeekendSchedulesInSchedulePeriod').subscribe((res) => {
          expect(res.schedulePeriods.length).toBe(1);
          done();
        });
        const uri = (MockEnvService.baseApiPath +
          new EmployeeStaffingCommitmentSdkConfig().APPROVED_HOURS_STAFF_COMMITMENT_URL)
          .replace('{employeeCode}', employeeCode)
          .replace('{startDate}', mockDateFormatter.toUrlDate(startDate))
          .replace('{endDate}', mockDateFormatter.toUrlDate(endDate))
          .replace('{periodStage}', 'SelfSchedule')
          .replace('{commitmentType}', 'MinimumApprovedHoursSchedulePeriod')
          .replace('{commitmentType}', 'MinimumWeekendSchedulesInSchedulePeriod');
        httpClientMock.expectOne(uri);
      });
    });
  });

});
