
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {

  constructor() { }

  load() {
    //  assign main window Google Analytics object to iframe window object
    (<any> window).ga = (<any> window).top.ga;
  }

}
