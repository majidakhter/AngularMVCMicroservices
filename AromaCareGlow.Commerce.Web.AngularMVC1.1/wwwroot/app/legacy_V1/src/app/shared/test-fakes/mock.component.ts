import { Component } from '@angular/core';

/*istanbul ignore next*/
export function MockComponent(options: Component) {
    const metadata: Component = {
        selector: options.selector,
        template: options.template || '',
        inputs: options.inputs,
        outputs: options.outputs
    };

    return Component(metadata)(class C {});
}
