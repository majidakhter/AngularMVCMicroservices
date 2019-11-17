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
var accordion_item_component_1 = require("../accordion-item/accordion-item.component");
var AccordionComponent = (function () {
    function AccordionComponent() {
        this.subscriptions = [];
        this._accordions = [];
    }
    AccordionComponent.prototype.ngOnInit = function () {
    };
    AccordionComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._accordions = this.items;
        this.removeSubscriptions();
        this.addSubscriptions();
        this.items.changes.subscribe(function (rex) {
            _this._accordions = rex;
            _this.removeSubscriptions();
            _this.addSubscriptions();
        });
    };
    AccordionComponent.prototype.addSubscriptions = function () {
        var _this = this;
        this._accordions.forEach(function (a) {
            var subscription = a.toggleAccordion.subscribe(function (e) {
                _this.toogleAccordion(a);
            });
            _this.subscriptions.push(subscription);
        });
    };
    AccordionComponent.prototype.removeSubscriptions = function () {
        this.subscriptions.forEach(function (sub) {
            sub.unsubscribe();
        });
    };
    AccordionComponent.prototype.toogleAccordion = function (accordion) {
        if (!accordion.active) {
            this.items.forEach(function (a) { return a.active = false; });
        }
        // set active accordion
        accordion.active = !accordion.active;
    };
    AccordionComponent.prototype.ngOnDestroy = function () {
        this.removeSubscriptions();
    };
    __decorate([
        core_1.ContentChildren(accordion_item_component_1.AccordionItemComponent),
        __metadata("design:type", core_1.QueryList)
    ], AccordionComponent.prototype, "items", void 0);
    AccordionComponent = __decorate([
        core_1.Component({
            selector: 'app-accordion',
            templateUrl: './app/customcomponent/accordion/accordion.component.html',
            styleUrls: ['./app/customcomponent/accordion/accordion.component.css'],
        }),
        __metadata("design:paramtypes", [])
    ], AccordionComponent);
    return AccordionComponent;
}());
exports.AccordionComponent = AccordionComponent;
