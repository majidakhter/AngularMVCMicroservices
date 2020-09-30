

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingPlaceholderDirective } from './loading-placeholder.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [LoadingPlaceholderDirective],
  exports: [LoadingPlaceholderDirective]
})
export class LoadingPlaceholderModule { }
