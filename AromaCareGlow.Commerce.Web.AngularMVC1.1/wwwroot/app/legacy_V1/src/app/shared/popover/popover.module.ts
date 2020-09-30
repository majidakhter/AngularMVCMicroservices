
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { WfmPopoverComponent } from './popover.component';
import { WfmPopoverDirective } from './popover.directive';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  declarations: [
    WfmPopoverComponent,
    WfmPopoverDirective
  ],
  exports: [
    WfmPopoverDirective
  ],
  entryComponents: [WfmPopoverComponent]
})
export class WfmPopoverModule { }
