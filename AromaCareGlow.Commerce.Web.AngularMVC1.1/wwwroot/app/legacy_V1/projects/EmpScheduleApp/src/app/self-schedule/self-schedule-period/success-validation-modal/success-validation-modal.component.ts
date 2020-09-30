
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'success-validation-modal',
  templateUrl: './success-validation-modal.component.html',
  styleUrls: ['./success-validation-modal.component.scss']
})
export class SuccessValidationModalComponent {
  @Output() close = new EventEmitter<boolean>();
  constructor() { }

  closeApprovalModal() {
    this.close.emit();
  }
}
