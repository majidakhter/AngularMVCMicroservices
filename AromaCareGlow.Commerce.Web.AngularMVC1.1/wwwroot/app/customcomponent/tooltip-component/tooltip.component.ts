import {Input, Component, TemplateRef, AfterViewInit, ElementRef} from '@angular/core';
import { TootipOptions } from './tooltipoption';
import { PositionHelper } from './position.helper';
declare var $: any;

@Component({
    selector: 'tooltip',
    templateUrl: './app/customcomponent/tooltip-component/tooltip.component.html',
    styles: [
        `
            :host {
                border: 1px solid #ccc;
                background: white;
                border-radius: 5px;
                padding: 10px;
                box-shadow: 1px 2px 3px rgba(0,0,0,0.15);
                position: fixed
            }

            :host > .arrow {
                position: absolute;
                display: block;
                width: 0;
                height: 0;
                border-color: transparent;
                border-style: solid;
                border-width: 11px;
            }

            :host > .arrow:after {
                position: absolute;
                display: block;
                width: 0;
                height: 0;
                border-color: transparent;
                border-style: solid;
                border-width: 10px;
                content: "";
            }

            :host(.top) > .arrow {    
                left: 50%;
                margin-left: -11px;
                border-bottom-width: 0;
                border-top-color: #ccc;
                bottom: -11px;
            }

            :host(.top) > .arrow:after {
                bottom: 1px;
                margin-left: -10px;
                border-bottom-width: 0;
                border-top-color: #fff;
            }

            :host(.bottom) > .arrow {    
                left: 50%;
                margin-left: -11px;
                border-top-width: 0;
                border-bottom-color: #ccc;
                top: -11px;
            }

            :host(.bottom) > .arrow:after {
                top: 1px;
                margin-left: -10px;
                border-top-width: 0;
                border-bottom-color: #fff;
            }

            :host(.right) > .arrow {    
                top: 50%;
                left: -11px;
                margin-top: -11px;
                border-left-width: 0;
                border-right-color: #ccc;
            }

            :host(.right) > .arrow:after {
                left: 1px;
                bottom: -10px;
                border-left-width: 0;
                border-right-color: #fff;
            }

            :host(.left) > .arrow {    
                top: 50%;
                right: -11px;
                margin-top: -11px;
                border-right-width: 0;
                border-left-color: #ccc;
            }

            :host(.left) > .arrow:after {
                right: 1px;
                bottom: -10px;
                border-right-width: 0;
                border-left-color: #fff;
            }

            .inner {
                font-size: 12px;
            }
        `
    ]
})
export class ToolTipComponent implements AfterViewInit {
    @Input() private content: TemplateRef<Object>;
    @Input() private parentEl: ElementRef;
    @Input() private tooltipOption: TootipOptions;
    constructor(private positionhelper:PositionHelper,public elementRef: ElementRef) {

    }

    ngAfterViewInit() {
        this.position();
    }
    private position() {
        $(this.elementRef.nativeElement).addClass([
            this.tooltipOption.position,
            this.tooltipOption.popupClass
        ].join(""));
        let position = this.positionhelper.positionElements(this.parentEl.nativeElement, this.elementRef.nativeElement, this.tooltipOption.position, this.tooltipOption.margin, false);
        $(this.elementRef.nativeElement).css(
            {
                top: position.top + "px",
                left: position.left + "px",
                display: "block",
            });
    }
}