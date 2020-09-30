import { async } from '@angular/core/testing';

import { QuickScheduleTopbarComponent } from './quick-schedule-topbar.component';
import { TranslateService } from '@ngx-translate/core';

describe('QuickScheduleTopbarComponent', () => {
  let component: QuickScheduleTopbarComponent;
  let mockTranlateService: jasmine.SpyObj<TranslateService>;
  let mockEmployee = {
    "id": 4943,
    "code": "Admin19",
    "firstName": "Raoul",
    "lastName": "Silva M",
    "middleName": null,
    "preferredName": "Administrative User 19",
    "employment": {
      "profession": {
        "jobClass": {
          "id": 187,
          "code": "99991",
          "name": "ADM JC 01",
          "number": 187
        },
        "shift": {
          "id": 1,
          "code": "1",
          "name": "Day Shift",
          "number": 1
        },
        "fte": 0,
        "classification": {
          "id": 1,
          "code": "FT",
          "name": "Full-Time Hourly",
          "number": null
        },
        "approvedHours": 0,
        "weeklyOvertimeHours": 0,
        "position": null,
        "hireDate": "2000-01-01",
        "seniorityDate": "2000-01-01",
        "project": null,
        "grant": null
      },
      "location": {
        "facility": {
          "id": 160,
          "code": "ADMINS",
          "name": "ADMINS",
          "number": 99991
        },
        "department": {
          "id": 161,
          "code": "ADMINS",
          "name": "ADMINS",
          "number": 99993
        },
        "unit": null,
        "timeZoneId": "America/Chicago"
      },
      "effectiveDate": "2007-07-22",
      "expireDate": null,
      "classification": "PrimaryHome"
    }
  };

  beforeEach(async(() => {
    mockTranlateService = jasmine.createSpyObj("TranslateService", ['instant']);
    component = new QuickScheduleTopbarComponent(
      mockTranlateService
    );
  }
  ));

  describe('#OnInit', () => {
    beforeEach(() => {
      component.employee = mockEmployee;
      component.ngOnInit();
    });

    it('should set empolyee first name', () => {
      expect(component.employee.firstName).toBe(mockEmployee.firstName);
    });

    it('should set empolyee last name', () => {
      expect(component.employee.lastName).toBe(mockEmployee.lastName);
    });
    it('should set empolyee approved hours', () => {
      expect(component.employee.employment.profession.approvedHours).toBe(mockEmployee.employment.profession.approvedHours);
    });
    it('should set empolyee facility', () => {
      expect(component.employee.employment.location.facility.name).toBe(mockEmployee.employment.location.facility.name);
    });
    it('should set empolyee job class', () => {
      expect(component.employee.employment.profession.jobClass.name).toBe(mockEmployee.employment.profession.jobClass.name);
    });
    it('should set empolyee department', () => {
      expect(component.employee.employment.location.department.name).toBe(mockEmployee.employment.location.department.name);
    });
    it('should set empolyee shift', () => {
      expect(component.employee.employment.profession.shift.name).toBe(mockEmployee.employment.profession.shift.name);
    });
  });
});
