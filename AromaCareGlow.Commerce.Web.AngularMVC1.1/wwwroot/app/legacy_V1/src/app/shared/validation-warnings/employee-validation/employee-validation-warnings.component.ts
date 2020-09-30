

import { Component, Input, OnInit } from '@angular/core';
import { IEmployeeValidationWarnings } from '../models/employee-validation-warnings';

@Component({
  selector: 'wf-employee-validation-warnings',
  templateUrl: './employee-validation-warnings.component.html',
  styleUrls: ['./employee-validation-warnings.component.scss']
})

export class EmployeeValidationWarningsComponent implements OnInit {
  @Input() employeeWarnings: IEmployeeValidationWarnings[];

  constructor() {}

  ngOnInit() {
  }
}
