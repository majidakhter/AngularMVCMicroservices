

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IScheduleCalendarWeek } from 'src/app/shared/schedule-calendar/models/IScheduleCalendarWeek';
import * as _ from 'lodash';
import { IActivityWithConfig } from 'src/app/time-management-domain/activity';
import { IPayCodeWithIndicatorConfiguration } from 'src/app/time-management-domain/pay-code';
import { IScheduleCalendarDay } from 'src/app/shared/schedule-calendar/models/IScheduleCalendarDay';
import { ISchedule } from 'src/app/time-management-domain/schedule';
import { SchedulePeriod } from 'src/app/shared/calendar/schedule-period';
import { Store } from '@ngxs/store';
import { EmployeeStaffingCommitmentSdkService } from 'src/app/time-management-sdk/employee-staffing-commitment-sdk/employee-staffing-commitment-sdk.service';
import { SelfScheduleState } from '../../../store/self-schedule/states/self-schedule.state';
import { Employee } from 'src/app/time-management-domain/employee';
import { StaffCommitmentSchedulePeriod } from 'src/app/time-management-domain/staff-commitment-schedule-period';
import { IStaffCommitments } from 'src/app/time-management-domain/IStaffCommitments';
import { IEmployeeStaffingCommitmentResponse } from 'src/app/time-management-sdk/employee-staffing-commitment-sdk/employee-staffing-commitment-response';
import { SetCommitmentsRefreshStatus } from '../../../store/self-schedule/actions/self-schedule.actions';

export enum commitmentType {
  MinimumApprovedHoursSchedulePeriod = 'MinimumApprovedHoursSchedulePeriod',
  MinimumWeekendSchedulesInSchedulePeriod = 'MinimumWeekendSchedulesInSchedulePeriod'
}

@Component({
  selector: 'wf-self-schedule-commitments',
  templateUrl: './self-schedule-commitments.component.html',
  styleUrls: ['./self-schedule-commitments.component.scss']
})
export class SelfScheduleCommitmentsComponent implements OnInit, OnChanges {

  @Input() commitments: Array<IScheduleCalendarWeek>;
  @Input() schedulePeriod: SchedulePeriod;
  totalShifts: number;
  totalOnCallHours: number;
  totalTimeOffHours: number;
  actualHours: number;
  targetHours: number;
  actualShifts: number;
  targetShifts: number;
  schedulePeriods: Array<SchedulePeriod> = [];
  selfSchedulePeriod;
  loggedInEmployee: Employee;
  isRefreshPending: boolean;
  constructor(
    private employeeStaffingCommitmentSdkService: EmployeeStaffingCommitmentSdkService,
    private store: Store) { }

  ngOnInit() {
    this.totalShifts = 0;
    this.totalTimeOffHours = 0;
    this.totalOnCallHours = 0;
    this.actualHours = 0;
    this.targetHours = 0;
    this.actualShifts = 0;
    this.targetShifts = 0;
    this.isRefreshPending = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.commitments && changes.commitments.previousValue) {
      if ((!(this.getAllActivities(changes.commitments.previousValue).toString() === this.getAllActivities(changes.commitments.currentValue).toString())) || this.getAllActivities(changes.commitments.previousValue).length == 0 ) {
        this.store.dispatch(new SetCommitmentsRefreshStatus(false));
        this.getHoursAndShiftCommitmentsPerSchedulePeriod();
        const calendarWeeksWithoutOverlappingPayCodes = this.removePayCodesLinkedWithActivities(this.commitments);
        this.getTotalShifts(calendarWeeksWithoutOverlappingPayCodes);
        this.getTimeOffHours(calendarWeeksWithoutOverlappingPayCodes);
        this.getOnCallHours(calendarWeeksWithoutOverlappingPayCodes);
      }
    }
  }

  private getTotalShifts(calenderWeeks: Array<IScheduleCalendarWeek>) {
    let totalShifts = 0;
    _.map(calenderWeeks, (arr: IScheduleCalendarWeek) => {
      _.map(arr.days, (day: IScheduleCalendarDay) => {
        _.map(day.events, (ev: ISchedule) => {
          const activity = <IActivityWithConfig > ev.activity;
          const payCode = <IPayCodeWithIndicatorConfiguration > ev.payCode;
          if (ev.status !== 'Requested') {
            if (activity && !activity.configuration.isTimeOff && !activity.configuration.isOnCall) {
              totalShifts++;
            }
          }
        });
      });
      this.totalShifts = totalShifts;
    });
  }

  private getTimeOffHours(calenderWeeks: Array<IScheduleCalendarWeek>) {
    let timeOffHours = 0;
    _.map(calenderWeeks, (arr: IScheduleCalendarWeek) => {
      _.map(arr.days, (day: IScheduleCalendarDay) => {
        _.map(day.events, (ev: ISchedule) => {
          const activity = <IActivityWithConfig > ev.activity;
          const payCode = <IPayCodeWithIndicatorConfiguration > ev.payCode;
          if (ev.status !== 'Requested') {
            if (activity && activity.configuration.isTimeOff && !activity.configuration.isOnCall) {
              timeOffHours += ev.hours;
            } else if (payCode && payCode.configuration.isTimeOff && !payCode.configuration.isOnCall) {
              timeOffHours += ev.hours;
            }
          }
        });
      });
      this.totalTimeOffHours = timeOffHours;
    });
  }

  private getOnCallHours(calenderWeeks: Array<IScheduleCalendarWeek>) {
    let onCallHours = 0;
    calenderWeeks.forEach((week) => {
      week.days.forEach((day) => {
        day.events.forEach((event) => {
          const activity = <IActivityWithConfig > event.activity;
          const paycode = <IPayCodeWithIndicatorConfiguration > event.payCode;
          if (event.status !== 'Requested') {
            if (activity && activity.configuration.isOnCall) {
              onCallHours += event.hours;
            } else if (paycode && paycode.configuration.isOnCall) {
              onCallHours += event.hours;
            }
          }
        });
      });
      this.totalOnCallHours = onCallHours;
    });
  }

  private removePayCodesLinkedWithActivities(weeks: Array<IScheduleCalendarWeek>): Array<IScheduleCalendarWeek> {
    const weeksWithoutLinkedPayCodes: Array<IScheduleCalendarWeek> = _.cloneDeep(weeks);
    weeksWithoutLinkedPayCodes.forEach((week) => {
      week.days.forEach((day) => {
        day.events.forEach((event) => {
          if (event.activity && event.payCode) {
            event.payCode = null;   // Remove paycode if a single event has both activity and paycode
          }
        });
      });
    });
    return weeksWithoutLinkedPayCodes;
  }

  getHoursAndShiftCommitmentsPerSchedulePeriod() {
    this.loggedInEmployee = this.store.selectSnapshot<Employee>(SelfScheduleState.getEmployee);
    this.schedulePeriods = this.store.selectSnapshot<Array<SchedulePeriod>>(SelfScheduleState.getSchedulePeriods);
    this.selfSchedulePeriod = this.schedulePeriod;

    this.checkRefreshedCommitment();
  }

  checkRefreshedCommitment() {
    let actualHours = 0;
    let targetHours = 0;
    let actualShifts = 0;
    let targetShifts = 0;
    const periodStage = 'SelfSchedule';
    let latestSchedulePeriod: StaffCommitmentSchedulePeriod[];
    this.employeeStaffingCommitmentSdkService.getStaffingCommitmentsForSchedulePeriod(this.loggedInEmployee.code,
      this.selfSchedulePeriod.start, this.selfSchedulePeriod.end,
      periodStage, commitmentType.MinimumApprovedHoursSchedulePeriod,
      commitmentType.MinimumWeekendSchedulesInSchedulePeriod).subscribe((res: IEmployeeStaffingCommitmentResponse) => {
        this.isRefreshPending = res.pendingSchedulePeriodValidation;
        latestSchedulePeriod = res.schedulePeriods;
        if (this.isRefreshPending) {
          setTimeout(() => { this.checkRefreshedCommitment(); }, 500);
        } else {
          this.store.dispatch(new SetCommitmentsRefreshStatus(true));
          _.map(latestSchedulePeriod, (arr: StaffCommitmentSchedulePeriod) => {
            _.map(arr.staffCommitments, (staffCommitments: IStaffCommitments) => {
              if (staffCommitments.type === commitmentType.MinimumApprovedHoursSchedulePeriod) {
                actualHours += staffCommitments.actual;
                targetHours += staffCommitments.target;
              } else {
                actualShifts = staffCommitments.actual;
                targetShifts = staffCommitments.target;
              }
            });
          });
          this.actualHours = actualHours;
          this.targetHours = targetHours;
          this.actualShifts = actualShifts;
          this.targetShifts = targetShifts;
          this.isRefreshPending = false;
        }
      }, error => {
        this.isRefreshPending = false;
      });
  }

  private getAllActivities(calendarWeeks) {
    const activities = [];
    calendarWeeks.forEach(calendarWeek =>
      calendarWeek.days.forEach(days => days.events.forEach(event => activities.push(event.activity ? event.activity.id : 0)))
    );
    return activities.sort();
  }
}
