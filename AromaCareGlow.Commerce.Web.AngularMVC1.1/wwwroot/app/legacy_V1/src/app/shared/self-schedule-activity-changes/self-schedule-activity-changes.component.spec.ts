import { SelfScheduleActivityChangesComponent } from './self-schedule-activity-changes.component';

describe('ScheduleCalendarComponent', () => {
  let component: SelfScheduleActivityChangesComponent;

  beforeEach(() => {
    component = createComponent();
  });

  function createComponent(): SelfScheduleActivityChangesComponent {
    component = new SelfScheduleActivityChangesComponent();
    return component;
  }

  describe('#ngOnInit', () => {
    let activity = { "id": 44, "code": "EVE8", "name": "EVE8", "startTime": "15:00:00", "hours": 8, "lunchHours": 0, "payCode": null, "configuration": null };
    it('component should be defined', () => {
      expect(component).toBeDefined();
    });

    it('retractClick function to be called', () => {
      expect(component.retractSelfScheduleActivity()).toBeTruthy;
      component.changeShift(activity);
    });

    it('changeShift function to be called', () => {
      expect(component.changeShift(activity)).toBeTruthy;
    });
  });
});