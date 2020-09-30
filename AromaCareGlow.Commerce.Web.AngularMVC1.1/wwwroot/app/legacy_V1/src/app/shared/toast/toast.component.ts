

import { Component, OnInit } from '@angular/core';
import { ToastService } from './toast.service';
import { IToastOptions } from './models/wfm-toast-options.model';
import { ToastEvents } from './models/wfm-toast-events';
import * as _ from 'lodash';

@Component({
  selector: 'wf-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {
  message: IToastOptions;
  isSelfSchedule = false;
  closeBnr = false;
  showCloseBtn = true;
  navigateUrl: string;
  constructor(
    public toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.toastService.activate = this.activate.bind(this);
  }

  activate(type: string, messageObj: IToastOptions, duration: number = 3000, isSelfSchedule: boolean = false, url: string = null) {
    if (type === ToastEvents.SHOW_AUTO_DISMISS_TOAST) {
      this.showCloseBtn = false;
      setTimeout(() => {
        this.message = null;
      }, duration);
    }
    if (typeof (messageObj.message) === 'string') {
      messageObj.message = [messageObj.message];
    }
    this.isSelfSchedule = isSelfSchedule;
    this.closeBnr = false;
    this.message = messageObj;
    this.navigateUrl = url;
  }

 /* istanbul ignore next */
  navigate() {
    top['Root']().NavigateTo(this.navigateUrl);
  }
}
