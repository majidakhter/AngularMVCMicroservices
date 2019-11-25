import {
    Input, Directive, ElementRef, HostListener, OnInit, ComponentRef
} from '@angular/core';

import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TooltipOverlayComponent } from './tooltipoverlay.component'
import { OverlayPositionBuilder } from '@angular/cdk/overlay/typings/position/overlay-position-builder';
import { ComponentPortal } from '@angular/cdk/portal';
@Directive({
    selector: "[highlight]"
})
export class Tooltipdirective implements OnInit {
    private overlayRef: OverlayRef;
    @Input('highlight') text = '';
    constructor(private overlayPositionBuilder: OverlayPositionBuilder,
        private elementRef: ElementRef,private overlay: Overlay) {

    }
    @HostListener('mouseenter')
    show() {
        const tooltipPortal = new ComponentPortal(TooltipOverlayComponent);
        const tooltipRef: ComponentRef<TooltipOverlayComponent> = this.overlayRef.attach(tooltipPortal);

        // Pass content to tooltip component instance
        tooltipRef.instance.text = this.text;
    }

    @HostListener('mouseout')
    hide() {
        this.overlayRef.detach();
    }

    ngOnInit() {
        
        const positionStrategy = this.overlayPositionBuilder
            // Create position attached to the elementRef
            .connectedTo(this.elementRef, { originX: 'center', originY: 'top' }, { overlayX: 'center', overlayY: 'bottom' });
            // Describe how to connect overlay to the elementRef
            // Means, attach overlay's center bottom point to the         
            // top center point of the elementRef.
            //.withPositions([{
              //  originX: 'center',
              //  originY: 'top',
              //  overlayX: 'center',
               // overlayY: 'bottom',
           // }]);
        this.overlayRef = this.overlay.create({ positionStrategy});
    }
    
}