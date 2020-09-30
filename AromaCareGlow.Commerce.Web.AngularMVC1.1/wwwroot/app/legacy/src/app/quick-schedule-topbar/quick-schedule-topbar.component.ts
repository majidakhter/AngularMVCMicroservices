
import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'wfm-quick-schedule-topbar',
  templateUrl: './quick-schedule-topbar.component.html',
  styleUrls: ['./quick-schedule-topbar.component.scss']
})

export class QuickScheduleTopbarComponent implements OnInit {
  @Input() employee;

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {

  
  }
}
