import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @Input() employee;
  private translateSuffix = '.%TRANSLATESUFFIX%';
  constructor(public translate: TranslateService) {
    // istanbul ignore else
    if (this.translateSuffix.endsWith('%')) {
      this.translateSuffix = '';
    }
  }

  ngOnInit() {
    let language = this.translate.getBrowserCultureLang().toLowerCase();
    this.translate.setDefaultLang('en-us');
    this.translate.use(language + this.translateSuffix);
  }
}
