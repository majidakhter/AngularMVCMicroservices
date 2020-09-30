import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'wf-overlap-shift-modal',
  templateUrl: './overlap-shift-modal.component.html',
  styleUrls: ['./overlap-shift-modal.component.scss']
})
export class OverlapShiftModalComponent {

  @Output() close = new EventEmitter<boolean>();
  constructor() { }

  closeOverlapModal() {
    this.close.emit();
  }
}
