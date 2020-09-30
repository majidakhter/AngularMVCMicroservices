export class AppFeatures {
  isExtraShiftEnabled: boolean;
  isQualifiedStaffEnabled: boolean;
  isWeeklyViewEnabled: boolean;
  isWeeklyViewDemographicsPopoverEnabled: boolean;
  isWeeklyViewScheduleExceptionsEnabled: boolean;
  isWeeklyViewEditTargetNeedsEnabled: boolean;

  // Below are feature flags that we don't load from the server. Ultimately this and the above will be converted to use the third-party solution.
  isWeeklyViewAddQualifiedStaffEnabled  = true;
}
