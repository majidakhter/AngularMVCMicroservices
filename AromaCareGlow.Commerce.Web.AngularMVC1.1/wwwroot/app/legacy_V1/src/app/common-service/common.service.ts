import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public unsavedOption = new EventEmitter<boolean>();

  constructor() { }

  public getUnsavedOption(): EventEmitter<{}> {
    return this.unsavedOption;
  }

  public setUnsavedOption(unsaved: boolean) {
    this.unsavedOption.emit(unsaved);
  }
}
