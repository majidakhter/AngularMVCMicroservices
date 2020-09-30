

import { Injectable } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { IAnalyticsEvent, AnalyticsCategory } from './analytics-events/analytics-events';

//  declare var ga: any; //  Make the global 'ga' object available. See comments on line 56.

@Injectable()
export class AnalyticsService {

  constructor(
    private angulartics2: Angulartics2
  ) { }

  /**
   * Send an event to Google Analytics
   * @param action The action to be sent to google analytics
   * @param category The Category of the event
   * @param label Optional: the label of the event
   * @param dimensions Optional: A dictionary of hit-level scoped custom dimensions to apply to the event
   * @param value Optional: A value to log along with this event
   */
  public trackEvent(action: string, category: string, label?: string, dimensions?: { [dimensionName: string]: string }, value?: number): void {
    const event = {
      action: action.toLowerCase(),
      properties: {
        category: category.toLowerCase()
      }
    };
    if (dimensions) {
      for (const dimension of Object.keys(dimensions)) {
        event.properties[dimension] = dimensions[dimension];
      }
    }
    if (label) {
      event.properties['label'] = label.toLowerCase();
    }

    if (value) {
      event.properties['value'] = value;
    }

    this.angulartics2.eventTrack.next(event);
  }

  public trackEventObj = (eventObj: IAnalyticsEvent, value?: number): void => {
    this.trackEvent(eventObj.action, eventObj.category, eventObj.label, undefined, value);
  }

  public trackPageView = (page: any, tab?: string): void => {
    let pageName, tabName;
    if (typeof page === 'string') {
      pageName = page;
      tabName = tab;
    } else if (typeof page === 'object' && page.trackPageAs) {
      pageName = page.trackPageAs;
      if (page.trackTabWith && page.trackTabWith.key) {
        tabName = page.trackTabWith.mappings ? page.trackTabWith.mappings[page[page.trackTabWith.key].toLowerCase()] : page[page.trackTabWith.key];
      }
    } else {
      return;
    }

    const path = '/monthly-view/' + (tabName ? pageName + '/' + tabName : pageName).toLowerCase();

    //  TODO: Ideally, we would be setting the page on the tracker so subsequent events are tied
    //  to that page vs. the location (which is always Default.aspx). But angulartics2 does not
    //  allow us to do that, so we'd have to manually call GA.
    //  ga('set', 'page', path);

    this.angulartics2.pageTrack.next({
      path: path
    });
  }
}

export class AnalyticsEvent implements IAnalyticsEvent {
  public values = [];
  constructor(
    public action: string,
    public category: AnalyticsCategory | string,
    public label?: string
  ) {
    this.values.push(action);
    this.values.push(category);
    if (label) {
      this.values.push(label);
    }
  }
}
