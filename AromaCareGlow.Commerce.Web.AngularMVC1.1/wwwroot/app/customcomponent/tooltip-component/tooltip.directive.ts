import {
    Input, Directive, ViewContainerRef, ComponentRef, TemplateRef, ContentChild, ElementRef, OnInit, OnChanges, Compiler,
    ModuleWithComponentFactories
} from '@angular/core';
import { TootipOptions, defaultTooltipOptions } from './tooltipoption';
import { PositionHelper } from './position.helper';
import { ToolTipComponent } from './tooltip.component';
import { ToolTipModule} from './tooltip.module'
//let $: any = window["$"];
declare var $: any;
declare var _: any;

@Directive({
    selector: "[tooltip]"
})
export class ToolTipDirective implements OnInit, OnChanges {
    @Input("tooltip") private tooltipOptions: any;
    @ContentChild("tooltipTemplate") private tooltipTemplate: TemplateRef<Object>;
    private tooltip: ComponentRef<ToolTipComponent>;
    private tooltipId: string;
    private tooltipFactory: ModuleWithComponentFactories<any>;
    constructor(private compiler: Compiler,
        private viewContainer: ViewContainerRef,
        public elementRef: ElementRef,
        private position: PositionHelper) {
        this.tooltipId = $('#tooltip').uniqueId();
        this.tooltipFactory = compiler.compileModuleAndAllComponentsSync(ToolTipModule);
    }
    ngOnInit() {
        let element = $(this.elementRef.nativeElement);
        //element.style.backgroundColor = 'yellow';
        if (!this.options.trigger.off) {
            element.on(this.options.trigger.on, () => {
                if (this.tooltip) {
                    this.hideTooltip();
                } else if (this.options.active === true) {
                    this.showTooltip();
                }
            });
        }
    }
    ngOnChanges() {
        if (this.options.active === false && this.tooltip) {
            this.hideTooltip();
        }
    }
    private destroyView() {
        if (this.viewContainer.length > 0) {
            this.viewContainer.remove(0);
        }

    }
     private showTooltip() {
        if (this.tooltipTemplate) {

            this.destroyView();
            this.tooltip = this.viewContainer.createComponent(this.tooltipFactory.componentFactories[0], 0);
            this.tooltip.instance["content"] = this.tooltipTemplate;
            this.tooltip.instance["parentEl"] = this.elementRef;
            this.tooltip.instance["tooltipOptions"] = this.options;

            if (this.options.dismissable) {
                $("html").on("mouseenter." + this.tooltipId, (event: any) => {
                    let $target = $(event.target);
                    if (!$target.closest(this.tooltip.instance.elementRef.nativeElement).length && !$target.closest(this.elementRef.nativeElement).length) {
                        this.hideTooltip();
                    }
                });
            }
        }
    }
    private hideTooltip() {
        this.tooltip.destroy();
        $("html").off("mouseleave." + this.tooltipId);
        this.tooltip = undefined;
    }
    private get options(): TootipOptions {
        return _.defaults({}, this.tooltipOptions || {}, defaultTooltipOptions);
    }
}