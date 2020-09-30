
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeManagementDomainModule } from '../../time-management-domain/time-management-domain.module';
import { NavigationService } from './navigation.service';
import { NavigationServiceConfig } from './navigationService.config';

@NgModule({
  imports: [
    CommonModule,
    TimeManagementDomainModule
  ],
  providers: [
    NavigationService,
    NavigationServiceConfig
  ]
})
export class NavigationServiceModule { }
