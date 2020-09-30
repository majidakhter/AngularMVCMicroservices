import { IIdentifier } from './identifier';
import { IJobClass } from './job-class';

export interface IPosition extends IIdentifier {
    jobClasses: IJobClass[];
}
