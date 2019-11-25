import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToolTipComponent } from './tooltip.component';
import { PositionHelper } from './position.helper'
@NgModule({
    imports: [
        BrowserModule
    ],
    declarations: [
        ToolTipComponent
    ],

    providers: [
        PositionHelper
    ],
    exports: [ToolTipComponent]
})
export class ToolTipModule { }