
import { TestBed } from '@angular/core/testing';
import { Angulartics2 } from 'angulartics2';
import { AnalyticsCategory, IAnalyticsEvent } from './analytics-events/analytics-events';
import { AnalyticsEvent, AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  const Angulartics2Mock = {
    pageTrack: {
      next: jasmine.createSpy('pageTrackSpy')
    },
    eventTrack: {
      next: jasmine.createSpy('eventTrackSpy')
    }
  };

  let analyticsService: AnalyticsService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnalyticsService,
        { provide: Angulartics2, useValue: Angulartics2Mock }
      ]
    });
    analyticsService = TestBed.get(AnalyticsService);
    Angulartics2Mock.pageTrack.next.calls.reset();
  });

  describe('#trackPageView', () => {
    describe('when sendGAPage(page: string) is called', () => {
      beforeEach(() => {
        analyticsService.trackPageView('testPage');
      });

      it('should send a Google Analytics Page Track Event', () => {
        expect(Angulartics2Mock.pageTrack.next).toHaveBeenCalledWith({
          path: '/monthly-view/testpage'
        });
      });
    });

    describe('when sendGAPage(page: string, tab: string) is called', () => {
      beforeEach(() => {
        analyticsService.trackPageView('testPage', 'testTab');
      });

      it('should append tab name to path and send a Google Analytics Page Track Event', () => {
        expect(Angulartics2Mock.pageTrack.next).toHaveBeenCalledWith({
          path: '/monthly-view/testpage/testtab'
        });
      });
    });

    describe('when sendGAPage() is called with parameters other than pageObject or string', () => {
      beforeEach(() => {
        analyticsService.trackPageView(3);
      });

      it('should not send a Google Analytics Page Track Event', () => {
        expect(Angulartics2Mock.pageTrack.next).not.toHaveBeenCalled();
      });
    });

    describe('when sendGAPage() is called with object that does not have trackPageAs property', () => {
      beforeEach(() => {
        analyticsService.trackPageView({});
      });

      it('should not send a Google Analytics Page Track Event', () => {
        expect(Angulartics2Mock.pageTrack.next).not.toHaveBeenCalled();
      });
    });

    describe('when sendGAPage(page: pageObject) is called', () => {
      beforeEach(() => {
        analyticsService.trackPageView({
          trackPageAs: 'testPage'
        });
      });

      it('should send a Google Analytics Page Track Event', () => {
        expect(Angulartics2Mock.pageTrack.next).toHaveBeenCalledWith({
          path: '/monthly-view/testpage'
        });
      });
    });

    describe('when sendGAPage(page: pageObject) is called with a tab subpage', () => {
      beforeEach(() => {
        analyticsService.trackPageView({
          trackPageAs: 'testPage',
          trackTabWith: {
            key: 'tab'
          },
          tab: 'testTab'
        });
      });

      it('should append page tab name and send a Google Analytics Page track Event', () => {
        expect(Angulartics2Mock.pageTrack.next).toHaveBeenCalledWith({
          path: '/monthly-view/testpage/testtab'
        });
      });
    });

    describe('when sendGAPage(page: pageObject) is called with a tab subpage and a mapping', () => {
      beforeEach(() => {
        analyticsService.trackPageView({
          trackPageAs: 'testPage',
          trackTabWith: {
            key: 'tab',
            mappings: {
              testtab: 'test-tab'
            }
          },
          tab: 'testTab'
        });
      });

      it('should append mapped page tab name and send a Google Analytics Page track Event', () => {
        expect(Angulartics2Mock.pageTrack.next).toHaveBeenCalledWith({
          path: '/monthly-view/testpage/test-tab'
        });
      });
    });
  });

  describe('When tracking an event with trackEvent', () => {
    beforeEach(() => {
      Angulartics2Mock.eventTrack.next.calls.reset();
    });
    describe('when an action and category is set', () => {
      beforeEach(() => {
        analyticsService.trackEvent('Approve', 'Requests');
      });

      it('should send a Google Analytics event', () => {
        expect(Angulartics2Mock.eventTrack.next).toHaveBeenCalledWith({
          action: 'approve',
          properties: {
            category: 'requests'
          }
        });
      });
    });

    describe('when an action, category, and label is set', () => {
      beforeEach(() => {
        analyticsService.trackEvent('Approve', 'Requests', 'Success');
      });

      it('should send a Google Analytics event with a label', () => {
        expect(Angulartics2Mock.eventTrack.next).toHaveBeenCalledWith({
          action: 'approve',
          properties: {
            category: 'requests',
            label: 'success'
          }
        });
      });
    });

    describe('when an action, category, and dimension is set', () => {
      const dimension1 = 'D1';
      const dimension2 = 'Dimen2';
      beforeEach(() => {
        analyticsService.trackEvent('Approve', 'Requests', undefined, {
          dimension1: dimension1,
          dimension2: dimension2
        });
      });

      it('should call through to Angulartics to set a user property', () => {
        expect(Angulartics2Mock.eventTrack.next).toHaveBeenCalledWith({
          action: 'approve',
          properties: {
            category: 'requests',
            dimension1: dimension1,
            dimension2: dimension2
          }
        });
      });
    });
  });

  describe('#trackEventObj', () => {
    const event: IAnalyticsEvent = {
      action: 'The-Action',
      category: AnalyticsCategory.ACTIVITY,
      label: 'The-Label'
    } as IAnalyticsEvent;

    describe('when a value is provided', () => {
      const value = 123;

      beforeEach(() => {
        analyticsService.trackEventObj(event, value);
      });

      it('logs the event with the value param', () => {
        expect(Angulartics2Mock.eventTrack.next).toHaveBeenCalledWith({
          action: 'the-action',
          properties: {
            category: 'activity',
            label: 'the-label',
            value: 123
          }
        });
      });
    });

    describe('when a value is not provided', () => {
      beforeEach(() => {
        analyticsService.trackEventObj(event);
      });

      it('logs the event without the value param', () => {
        expect(Angulartics2Mock.eventTrack.next).toHaveBeenCalledWith({
          action: 'the-action',
          properties: {
            category: 'activity',
            label: 'the-label'
          }
        });
      });
    });
  });

  describe('When creating an AnalyticsEvent with a label', () => {
    let event: AnalyticsEvent;
    beforeEach(() => {
      event = new AnalyticsEvent('action', 'category', 'label');
    });

    it('should add label to AnalyticsEvent', () => {
      expect(event.values).toEqual(['action', 'category', 'label']);
    });
  });

  describe('When creating an AnalyticsEvent with no label', () => {
    let event: AnalyticsEvent;
    beforeEach(() => {
      event = new AnalyticsEvent('action', 'category');
    });

    it('should add label to AnalyticsEvent', () => {
      expect(event.values).toEqual(['action', 'category']);
    });
  });
});
