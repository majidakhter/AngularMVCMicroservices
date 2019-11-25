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
var tooltipoption_1 = require("./tooltipoption");
var position_helper_1 = require("./position.helper");
var tooltip_module_1 = require("./tooltip.module");
var ToolTipDirective = (function () {
    function ToolTipDirective(compiler, viewContainer, elementRef, position) {
        this.compiler = compiler;
        this.viewContainer = viewContainer;
        this.elementRef = elementRef;
        this.position = position;
        this.tooltipId = $('#tooltip').uniqueId();
        this.tooltipFactory = compiler.compileModuleAndAllComponentsSync(tooltip_module_1.ToolTipModule);
    }
    ToolTipDirective.prototype.ngOnInit = function () {
        var _this = this;
        var element = $(this.elementRef.nativeElement);
        //element.style.backgroundColor = 'yellow';
        if (!this.options.trigger.off) {
            element.on(this.options.trigger.on, function () {
                if (_this.tooltip) {
                    _this.hideTooltip();
                }
                else if (_this.options.active === true) {
                    _this.showTooltip();
                }
            });
        }
    };
    ToolTipDirective.prototype.ngOnChanges = function () {
        if (this.options.active === false && this.tooltip) {
            this.hideTooltip();
        }
    };
    ToolTipDirective.prototype.destroyView = function () {
        if (this.viewContainer.length > 0) {
            this.viewContainer.remove(0);
        }
    };
    ToolTipDirective.prototype.showTooltip = function () {
        var _this = this;
        if (this.tooltipTemplate) {
            this.destroyView();
            this.tooltip = this.viewContainer.createComponent(this.tooltipFactory.componentFactories[0], 0);
            this.tooltip.instance["content"] = this.tooltipTemplate;
            this.tooltip.instance["parentEl"] = this.elementRef;
            this.tooltip.instance["tooltipOptions"] = this.options;
            if (this.options.dismissable) {
                $("html").on("mouseenter." + this.tooltipId, function (event) {
                    var $target = $(event.target);
                    if (!$target.closest(_this.tooltip.instance.elementRef.nativeElement).length && !$target.closest(_this.elementRef.nativeElement).length) {
                        _this.hideTooltip();
                    }
                });
            }
        }
    };
    ToolTipDirective.prototype.hideTooltip = function () {
        this.tooltip.destroy();
        $("html").off("mouseleave." + this.tooltipId);
        this.tooltip = undefined;
    };
    Object.defineProperty(ToolTipDirective.prototype, "options", {
        get: function () {
            return _.defaults({}, this.tooltipOptions || {}, tooltipoption_1.defaultTooltipOptions);
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input("tooltip"),
        __metadata("design:type", Object)
    ], ToolTipDirective.prototype, "tooltipOptions", void 0);
    __decorate([
        core_1.ContentChild("tooltipTemplate"),
        __metadata("design:type", core_1.TemplateRef)
    ], ToolTipDirective.prototype, "tooltipTemplate", void 0);
    ToolTipDirective = __decorate([
        core_1.Directive({
            selector: "[tooltip]"
        }),
        __metadata("design:paramtypes", [core_1.Compiler,
            core_1.ViewContainerRef,
            core_1.ElementRef,
            position_helper_1.PositionHelper])
    ], ToolTipDirective);
    return ToolTipDirective;
}());
exports.ToolTipDirective = ToolTipDirective;
