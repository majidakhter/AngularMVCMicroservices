import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    templateUrl: './app/customcomponent/confirmation-dialog/confirmation-dialog.component.html',
    selector:'app-confirmation-dialog'

})
export class ConfirmationDialogComponent implements OnInit{
    @Input() title: string;
    @Input() message: string;
    @Input() btnOkText: string;
    @Input() btnCancelText: string;
    constructor(private activeModal: NgbActiveModal) {

    }
    ngOnInit() {

    }
    public decline() {
        this.activeModal.close(false);
    }
    public accept() {
        this.activeModal.close(true);
    }
    public dismiss() {
        this.activeModal.dismiss();
    }
}