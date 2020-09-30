import { Component } from '@angular/core';
import { TradeOrganizationUnitsComponent } from './trade-summary/trade-organization-units/trade-organization-units.component';

@Component({
  selector: 'wf-monthly-view',
  templateUrl: './monthly-view.component.html',
  styleUrls: ['./monthly-view.component.scss']
})
export class MonthlyViewComponent {
  public organizationUnitsFilter = TradeOrganizationUnitsComponent;
}
