import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchListComponent, TranslatePipe } from './search-list.component';
import { DomHelper } from '../helpers/dom-api/dom-helper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [DomHelper],
  exports: [SearchListComponent],
  declarations: [SearchListComponent, TranslatePipe]
})
export class SearchListModule {
  static forChild(translateService?: any): ModuleWithProviders {
    return {
      ngModule: SearchListModule,
      providers: [
        { provide: 'translateService', useClass: translateService }
      ]
    };
  }
}
