
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ISection } from 'src/app/time-management-domain/section';
import { NavigationServiceConfig } from './navigationService.config';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

@Injectable()
export class NavigationService {
  constructor(private http: HttpClient,
    private navigationServiceConfig: NavigationServiceConfig) {
  }

  /**
   * Gets the available navigation sections from the server.
   */
  getNavigationSections() {
    const rootPath = top.location.href.substr(
      0,
      top.location.href.lastIndexOf('/') + 1
    );
    const uri = rootPath + this.navigationServiceConfig.GET_NAVIGATION_SECTIONS_URL;
    return this.http.get<ISection[]>(uri).pipe(
      map(section => {
        return section;
      })
    );
  }

  getSelfScheduleNavigationUrl(): Observable<string> {
    const rootPath = top.location.href.substr(
      0,
      top.location.href.lastIndexOf('/') + 1
    );
    return this.getNavigationSections().pipe(map(section => {
      const selfScheduleSection = _.find((_.find(section, (s) => s.name === 'sections.myScheduleMain')).subMenu, (e) => e.name === 'sections.mySchedule.selfSchedule');
      const urlToSelfSchedule = rootPath + selfScheduleSection.pageUrl;
      return urlToSelfSchedule;
    }));
  }
}
