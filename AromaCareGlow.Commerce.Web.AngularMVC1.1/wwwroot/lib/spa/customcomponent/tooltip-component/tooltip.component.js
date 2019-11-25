"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var position_helper_1 = require("./position.helper");
var ToolTipComponent = (function () {
    function ToolTipComponent(positionhelper, elementRef) {
        this.positionhelper = positionhelper;
        this.elementRef = elementRef;
    }
    ToolTipComponent.prototype.ngAfterViewInit = function () {
        this.position();
    };
    ToolTipComponent.prototype.position = function () {
        $(this.elementRef.nativeElement).addClass([
            this.tooltipOption.position,
            this.tooltipOption.popupClass
        ].join(""));
        var position = this.positionhelper.positionElements(this.parentEl.nativeElement, this.elementRef.nativeElement, this.tooltipOption.position, this.tooltipOption.margin, false);
        $(this.elementRef.nativeElement).css({
            top: position.top + "px",
            left: position.left + "px",
            display: "block",
        });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", core_1.TemplateRef)
    ], ToolTipComponent.prototype, "content", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", core_1.ElementRef)
    ], ToolTipComponent.prototype, "parentEl", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ToolTipComponent.prototype, "tooltipOption", void 0);
    ToolTipComponent = __decorate([
        core_1.Component({
            selector: 'tooltip',
            templateUrl: './app/customcomponent/tooltip-component/tooltip.component.html',
            styles: [
                "\n            :host {\n                border: 1px solid #ccc;\n                background: white;\n                border-radius: 5px;\n                padding: 10px;\n                box-shadow: 1px 2px 3px rgba(0,0,0,0.15);\n                position: fixed\n            }\n\n            :host > .arrow {\n                position: absolute;\n                display: block;\n                width: 0;\n                height: 0;\n                border-color: transparent;\n                border-style: solid;\n                border-width: 11px;\n            }\n\n            :host > .arrow:after {\n                position: absolute;\n                display: block;\n                width: 0;\n                height: 0;\n                border-color: transparent;\n                border-style: solid;\n                border-width: 10px;\n                content: \"\";\n            }\n\n            :host(.top) > .arrow {    \n                left: 50%;\n                margin-left: -11px;\n                border-bottom-width: 0;\n                border-top-color: #ccc;\n                bottom: -11px;\n            }\n\n            :host(.top) > .arrow:after {\n                bottom: 1px;\n                margin-left: -10px;\n                border-bottom-width: 0;\n                border-top-color: #fff;\n            }\n\n            :host(.bottom) > .arrow {    \n                left: 50%;\n                margin-left: -11px;\n                border-top-width: 0;\n                border-bottom-color: #ccc;\n                top: -11px;\n            }\n\n            :host(.bottom) > .arrow:after {\n                top: 1px;\n                margin-left: -10px;\n                border-top-width: 0;\n                border-bottom-color: #fff;\n            }\n\n            :host(.right) > .arrow {    \n                top: 50%;\n                left: -11px;\n                margin-top: -11px;\n                border-left-width: 0;\n                border-right-color: #ccc;\n            }\n\n            :host(.right) > .arrow:after {\n                left: 1px;\n                bottom: -10px;\n                border-left-width: 0;\n                border-right-color: #fff;\n            }\n\n            :host(.left) > .arrow {    \n                top: 50%;\n                right: -11px;\n                margin-top: -11px;\n                border-right-width: 0;\n                border-left-color: #ccc;\n            }\n\n            :host(.left) > .arrow:after {\n                right: 1px;\n                bottom: -10px;\n                border-right-width: 0;\n                border-left-color: #fff;\n            }\n\n            .inner {\n                font-size: 12px;\n            }\n        "
            ]
        }),
        __metadata("design:paramtypes", [position_helper_1.PositionHelper, core_1.ElementRef])
    ], ToolTipComponent);
    return ToolTipComponent;
}());
exports.ToolTipComponent = ToolTipComponent;
