

import { Injectable } from '@angular/core';
import { IToastOptions } from './models/wfm-toast-options.model';

@Injectable()
export class ToastService {
  activate: (dismissType: string, message: IToastOptions, duration?: number, isSelfSchedule?: boolean, url?: string) => void;
}
