
import { TestBed } from '@angular/core/testing';
import { RetractSelfScheduleMessageService } from './retract-self-schedule-message.service';
describe('RetractSelfScheduleMessageService', () => {
  let service: RetractSelfScheduleMessageService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RetractSelfScheduleMessageService]
    });
    service = TestBed.get(RetractSelfScheduleMessageService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  it('get message', () => {
    service.getMessage();
  });

  it('send message', () => {
    const data = 'this is a testing message for retract';
    service.sendMessage(data);
  });
});
