

import { ToastComponent } from './toast.component';
import { ToastEvents } from './models/wfm-toast-events';
import { ToastOptions } from './models/wfm-toast-options.model';

describe('ToastComponent', () => {
  const mocktoastService = jasmine.createSpyObj('ToastService', ['activate']);
  let component;

  function CreateComponent() {
    return new ToastComponent(mocktoastService);
  }

  beforeAll(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2019, 8, 1, 1, 0, 0, 0));
  });

  afterAll(() => {
    jasmine.clock().uninstall();
  });

  beforeEach(() => {
    component = CreateComponent();
  });

  describe('#ngOnInit ', () => {
    beforeEach(() => {
      component.ngOnInit();
    });
    describe('when error message is sent', () => {
      beforeEach(() => {
        const msg = new ToastOptions('error', 'error', 'Unknown Error');
        const messageType = 'error';
        component.activate(messageType, msg);
      });
      it('should initialize title, message and severity', () => {
        expect(component.message.title).toEqual('error');
        expect(component.message.message).toEqual(['Unknown Error']);
        expect(component.message.severity).toEqual('error');
      });
    });

    describe('when error title and message is not set', () => {
      beforeEach(() => {
        const msg = new ToastOptions('error');
        const messageType = 'error';
        component.activate(messageType, msg);
      });
      it('should initialize title, message and severity', () => {
        expect(component.message.title).toEqual('');
        expect(component.message.message).toEqual(['']);
        expect(component.message.severity).toEqual('error');
      });
    });

    describe('when success message is sent', () => {
      describe('without duration', () => {
        beforeEach(() => {
          const msg = new ToastOptions('success', 'Success', 'Event added successfully');
          const messageType = ToastEvents.SHOW_AUTO_DISMISS_TOAST;
          component.activate(messageType, msg);
        });
        it('should initialize title, message and severity', () => {
          expect(component.message.title).toEqual('Success');
          expect(component.message.message).toEqual(['Event added successfully']);
          expect(component.message.severity).toEqual('success');
        });
      });
      describe('with duration', () => {
        beforeEach(() => {
          const msg = { severity: 'success', message: 'Event added successfully', title: 'Success' };
          const messageType = ToastEvents.SHOW_AUTO_DISMISS_TOAST;
          component.activate(messageType, msg, 1000);
        });
        it('should initialize title, message and severity and clear the message after the specified duration', () => {
          expect(component.message.title).toEqual('Success');
          expect(component.message.message).toEqual(['Event added successfully']);
          expect(component.message.severity).toEqual('success');
          jasmine.clock().tick(1000);
          expect(component.message).toBeNull();
        });
      });
    });

    describe('when informational message is sent', () => {
      beforeEach(() => {
        const msg = new ToastOptions('information', 'Information', 'Self Schedule is open');
        const messageType = 'information';
        component.activate(messageType, msg, null, true, 'url');
      });
      it('should initialize title, message and severity', () => {
        expect(component.message.title).toEqual('Information');
        expect(component.message.message).toEqual(['Self Schedule is open']);
        expect(component.message.severity).toEqual('information');
      });
    });

    describe('when informational message array is sent', () => {
      beforeEach(() => {
        const messages = ['self scheduling is open', 'june 12 - july 30'];
        const msg = new ToastOptions('information', 'Information', messages);
        const messageType = 'information';
        component.activate(messageType, msg, null, true, 'url');
      });
      it('should initialize title, message and severity', () => {
        expect(component.message.title).toEqual('Information');
        expect(component.message.message).toEqual(['self scheduling is open', 'june 12 - july 30']);
        expect(component.message.severity).toEqual('information');
        expect(component.closeBnr).toEqual(false);
      });
    });
  });
});
