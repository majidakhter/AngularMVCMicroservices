import {Input, Component } from '@angular/core'
@Component({
    selector: 'highlight-tooltip',
    templateUrl: './app/customcomponent/tooltipoverlay-component/tooltipoverlay.component.html',
    styles: ['./app/customcomponent/tooltipoverlay-component/tooltipoverlay.component.css']
})
export class TooltipOverlayComponent {
    @Input() text = '';
}