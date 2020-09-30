
import { Injectable } from '@angular/core';

/**
 * This service wraps the global document object so it can be injected into other components and, therefore, easily mocked
 * for testing.
 */
@Injectable()
export class DocumentRef {
  getDocument(): any {
    return document;
  }
}
