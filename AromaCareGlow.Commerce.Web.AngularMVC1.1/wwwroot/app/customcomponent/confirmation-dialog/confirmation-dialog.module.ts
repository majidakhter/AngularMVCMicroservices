import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmationDialogComponent } from '../../customcomponent/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from '../../customcomponent/confirmation-dialog/confirmation-dialog.service';


@NgModule({
    imports: [

        CommonModule,
        FormsModule,
        NgbModule.forRoot(),
        
    ],
    declarations: [
        ConfirmationDialogComponent
    ],

    providers: [
        ConfirmationDialogService

    ],
    entryComponents: [ConfirmationDialogComponent]
})
export class ConfirmationDialogModule { }