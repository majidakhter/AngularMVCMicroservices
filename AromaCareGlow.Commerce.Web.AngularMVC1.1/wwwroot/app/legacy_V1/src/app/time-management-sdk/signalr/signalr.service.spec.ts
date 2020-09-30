import { inject, TestBed } from '@angular/core/testing';
import { SignalrService } from './signalr.service';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { TranslateService } from '@ngx-translate/core';
import { SignalrConnectionStates } from './connection-states';
import { SignalrConfig } from './signalr.config';
import { EnvironmentService } from 'src/app/environment/environment.service';
import { MockEnvService } from 'src/app/shared/test-fakes/mock-env';
import { USE_VALUE } from '@angular/core/src/di/injector';

declare var $: any;
describe('SignalrService', () => {
    const mockLogger = jasmine.createSpyObj('NGXLogger', ['info']);
    const mockTranslateService = jasmine.createSpyObj('TranslateService', ['get']);
    let stateChanged: Function;
    const config = new SignalrConfig();
    const connectionIdMessage = 'signalr-connection-id';
    const hubConnection = {
        id: '123',
        createHubProxy: jasmine.createSpy('createHubProxy'),
        start: () => {
           return { done: function(callback){ callback(); }};
        },
        stateChanged: jasmine.createSpy('stateChanged').and.callFake((func: Function) => {
            stateChanged = func;
        }),
        stop: jasmine.createSpy('done')
    };

    let hubProxy = {
        on: function(eventName, callback){ callback(); },
        invoke: jasmine.createSpy('invoke')
    };
      beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SignalrService,
                {provide: NGXLogger, useValue: mockLogger},
                {provide: EnvironmentService, useValue: MockEnvService},
                {provide: TranslateService, useValue: mockTranslateService},
                {provide: SignalrConfig, useValue: config}
            ]
        });
        spyOn($, 'hubConnection').and.returnValue(hubConnection);
        spyOn(hubConnection.start(), 'done').and.callThrough();
        spyOn(hubProxy, 'on').and.callThrough();
        hubConnection.createHubProxy.and.returnValue(hubProxy);
        mockTranslateService.get.and.returnValue(Observable.of(connectionIdMessage));
    });

    it('should be created', inject([SignalrService], (service: SignalrService) => {
        expect(service).toBeTruthy();
    }));

    describe('on configure', () => {
        beforeEach(inject([SignalrService], (service: SignalrService) => {
            const connectiourl = MockEnvService.baseApiPath + config.ENDPOINT;
            service.configure();
        }));

        it('creates the hub proxy', inject([SignalrService], () => {
           expect(hubConnection.createHubProxy).toHaveBeenCalledWith('schedulingHub');
        }));

        describe('on startConnection', () => {
            beforeEach(inject([SignalrService], (service: SignalrService) => {
                service.startConnection();
            }));

            it('logs the connection id', () => {
                expect(mockLogger.info).toHaveBeenCalledWith(connectionIdMessage + hubConnection.id);
            });

            it('broadcasts connection completed', inject([SignalrService], (service: SignalrService) => {
                service.connectionCompleted.subscribe((connected) => {
                    expect(connected).toBeDefined();
                });


            }));

            describe('state changed event', () => {
                describe('state changes to disconnected', () => {
                    describe('and previous state was reconnecting', () => {
                        beforeEach( inject([SignalrService], (service: SignalrService) => {
                            service.connectionChanged.next = jasmine.createSpy('next');
                            stateChanged({newState: 4, oldState: 2} );
                        }));

                        it('should notify observers that the connection state is connection_lost', inject([SignalrService], (service: SignalrService) => {
                            expect(service.connectionChanged.next).toHaveBeenCalledWith(SignalrConnectionStates.connection_lost);
                        }));
                    });

                    describe('and previous state wasn not reconnecting', () => {
                        beforeEach( inject([SignalrService], (service: SignalrService) => {
                            service.connectionChanged.next = jasmine.createSpy('next');
                            stateChanged({newState: 4, oldState: 1} );
                        }));

                        it('should notify observers that the connection state is disconnected', inject([SignalrService], (service: SignalrService) => {
                            expect(service.connectionChanged.next).toHaveBeenCalledWith(SignalrConnectionStates.disconnected);
                        }));
                    });
                });


                describe('state changes to something besides disconnected', () => {
                    beforeEach( inject([SignalrService], (service: SignalrService) => {
                        service.connectionChanged.next = jasmine.createSpy('next');
                        stateChanged({newState: 0} );
                    }));

                    it('should notify observers that the connection state is reconnecting', inject([SignalrService], (service: SignalrService) => {
                        expect(service.connectionChanged.next).toHaveBeenCalledWith(SignalrConnectionStates.connecting);
                    }));
                });
            });
        });

        describe('on stopConnection', () => {
            beforeEach(inject([SignalrService], (service: SignalrService) => {
                service.stopConnection();
            }));

            it('stops the connection', () => {
                expect(hubConnection.stop).toHaveBeenCalled();
            });
        });

        describe('on triggerEvent', () => {
            beforeEach(inject([SignalrService], (service: SignalrService) => {
                hubProxy.invoke.and.returnValue({});
                service.triggerEvent('myEvent', []);
            }));

            it('triggers the event', inject([SignalrService], () => {
                expect(hubProxy.invoke).toHaveBeenCalledWith('myEvent');
            }));
        });

        describe('on registerEvent', () => {
            beforeEach(inject([SignalrService], (service: SignalrService) => {
                service.registerEvent('myEvent');
            }));

            it('assigns a subject to that event', inject([SignalrService], (service: SignalrService) => {
                expect(service.onEvent('myEvent')).toBeDefined();
            }));

            it('registers the event on the hub proxy', inject([SignalrService], () => {
                expect(hubProxy.on).toHaveBeenCalled();
            }));
        });
    });
});
