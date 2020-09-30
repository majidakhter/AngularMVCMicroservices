
import { Injectable } from '@angular/core';

/**
 * This service wraps the global window object so it can be injected into other components and, therefore, easily mocked
 * for testing.
 */
@Injectable()
export class WindowRef {
  public getWindow(): any {
    return window;
  }
}
