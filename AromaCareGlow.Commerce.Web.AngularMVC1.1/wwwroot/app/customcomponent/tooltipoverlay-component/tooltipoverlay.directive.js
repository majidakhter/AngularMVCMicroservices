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
var overlay_1 = require("@angular/cdk/overlay");
var tooltipoverlay_component_1 = require("./tooltipoverlay.component");
var overlay_position_builder_1 = require("@angular/cdk/overlay/typings/position/overlay-position-builder");
var portal_1 = require("@angular/cdk/portal");
var Tooltipdirective = /** @class */ (function () {
    function Tooltipdirective(overlayPositionBuilder, elementRef, overlay) {
        this.overlayPositionBuilder = overlayPositionBuilder;
        this.elementRef = elementRef;
        this.overlay = overlay;
        this.text = '';
    }
    Tooltipdirective.prototype.show = function () {
        var tooltipPortal = new portal_1.ComponentPortal(tooltipoverlay_component_1.TooltipOverlayComponent);
        var tooltipRef = this.overlayRef.attach(tooltipPortal);
        // Pass content to tooltip component instance
        tooltipRef.instance.text = this.text;
    };
    Tooltipdirective.prototype.hide = function () {
        this.overlayRef.detach();
    };
    Tooltipdirective.prototype.ngOnInit = function () {
        var positionStrategy = this.overlayPositionBuilder
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
        this.overlayRef = this.overlay.create({ positionStrategy: positionStrategy });
    };
    __decorate([
        core_1.Input('highlight'),
        __metadata("design:type", Object)
    ], Tooltipdirective.prototype, "text", void 0);
    __decorate([
        core_1.HostListener('mouseenter'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Tooltipdirective.prototype, "show", null);
    __decorate([
        core_1.HostListener('mouseout'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Tooltipdirective.prototype, "hide", null);
    Tooltipdirective = __decorate([
        core_1.Directive({
            selector: "[highlight]"
        }),
        __metadata("design:paramtypes", [overlay_position_builder_1.OverlayPositionBuilder,
            core_1.ElementRef, overlay_1.Overlay])
    ], Tooltipdirective);
    return Tooltipdirective;
}());
exports.Tooltipdirective = Tooltipdirective;
//# sourceMappingURL=tooltipoverlay.directive.js.map