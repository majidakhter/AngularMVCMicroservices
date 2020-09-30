import { IScheduleDetailed } from './schedule-with-details';
import { IActivityWithConfig } from './activity';
import { IPayCodeWithIndicatorConfiguration } from './pay-code';
import { ILocationWithConfig } from './location';

export interface ITrade {
  schedule: IScheduleDetailed<IActivityWithConfig, IPayCodeWithIndicatorConfiguration, ILocationWithConfig>;
  comment: string;
}

export interface ITradeRequest {
  requesting: ITrade;
  accepting: ITrade;
  isDenyNoteRequired: boolean;
  id: string;
}
