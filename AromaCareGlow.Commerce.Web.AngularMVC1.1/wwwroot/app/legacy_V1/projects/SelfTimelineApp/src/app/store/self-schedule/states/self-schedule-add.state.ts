

import { State, Action, StateContext, Selector } from '@ngxs/store';
import {  SetActivityStaffingPlanCoverages } from '../actions/self-schedule.actions';
import { IActivityStaffingPlanCoverage } from 'src/app/time-management-domain/coverage';

export interface IActivityStaffingPlanCoverages {
  activityStaffingPlanCoverages: IActivityStaffingPlanCoverage[];
}

@State<IActivityStaffingPlanCoverages>({
  name: 'ActivityStaffingPlanCoverages',
  defaults: {
    activityStaffingPlanCoverages: null
  }
})

export class SelfScheduleAdd {

  @Selector()
  static getActivityStaffingPlanCoverages(state: IActivityStaffingPlanCoverages): IActivityStaffingPlanCoverage[] {
    return state.activityStaffingPlanCoverages;
  }

  @Action(SetActivityStaffingPlanCoverages)
  SetActivityStaffingPlanCoverages(ctx: StateContext<IActivityStaffingPlanCoverages>, { payload }: SetActivityStaffingPlanCoverages) {
    ctx.patchState({
      activityStaffingPlanCoverages: payload
    });
  }

}
