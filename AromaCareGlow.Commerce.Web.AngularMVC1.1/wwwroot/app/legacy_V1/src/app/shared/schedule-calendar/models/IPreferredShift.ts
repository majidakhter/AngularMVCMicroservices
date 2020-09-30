import { IActivity } from 'src/app/time-management-domain/activity';
import { IProfile } from 'src/app/time-management-domain/profile';

export interface IPreferredShift {
    activity: IActivityWithProfile;
    timings: string;
    activityCode: string;
    needs: string;
  }
  
export interface IActivityWithProfile extends IActivity {
    configuration: string;
    profile: IProfile;
    selectedDate: string;
    etag: string;
}