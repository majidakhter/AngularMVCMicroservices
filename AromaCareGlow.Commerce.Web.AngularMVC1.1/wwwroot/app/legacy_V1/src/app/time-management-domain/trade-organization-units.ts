import { IOrganizationEntity } from './organization-entity';
import { IFilterable, AvailabilityOption } from './../../../../MonthlyView/projects/MonthlyViewApp/src/app/monthlyview/trade-summary/trade-organization-units/trade-organization-units.component';

export interface IAvailability {
  startTime: Date;
  endTime: Date;
  selectedAvailabilityOption: AvailabilityOption;
}

export interface ITradeOrganizationUnits {
  organizationUnits: (IFilterable & IOrganizationEntity)[];
  availability: IAvailability;

}

export class TradeOrganizationUnits implements ITradeOrganizationUnits {
  public organizationUnits: (IFilterable & IOrganizationEntity)[];
  public availability: IAvailability;
}
