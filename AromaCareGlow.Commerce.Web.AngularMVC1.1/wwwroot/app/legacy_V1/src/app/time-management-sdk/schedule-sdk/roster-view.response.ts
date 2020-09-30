

import { IProfileGroupItem, IRosterEmployeeResponse } from 'src/app/time-management-domain/roster-view';

export interface IRosterSummaryResponse {
    profileGroupItems: IProfileGroupItem[];
    profileItems: IProfileGroupItem[];
}

export interface IRosterEmployeeListResponse {
    roster: IRosterEmployeeResponse[];
}
