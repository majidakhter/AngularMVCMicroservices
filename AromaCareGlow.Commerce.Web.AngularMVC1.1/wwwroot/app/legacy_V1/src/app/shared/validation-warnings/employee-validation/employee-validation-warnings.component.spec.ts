

import { EmployeeValidationWarningsComponent } from './employee-validation-warnings.component';

describe('EmployeeValidationWarningsComponent', () => {
  let component: EmployeeValidationWarningsComponent;

  function createComponent() {
    return new EmployeeValidationWarningsComponent();
  }

  describe('#ngOnInit', () => {
    beforeEach(() => {
      component = createComponent();
      component.ngOnInit();
    });

    it('component should be defined', () => {
      expect(component).toBeDefined();
    });
  });
});
