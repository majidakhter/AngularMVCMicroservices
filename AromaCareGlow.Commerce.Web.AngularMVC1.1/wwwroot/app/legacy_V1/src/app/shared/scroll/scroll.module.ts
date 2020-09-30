

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WfScrollDirective } from './scroll.directive';

@NgModule({
  imports: [CommonModule],
  exports: [WfScrollDirective],
  declarations: [WfScrollDirective]
})
export class ScrollDirectiveModule { }
