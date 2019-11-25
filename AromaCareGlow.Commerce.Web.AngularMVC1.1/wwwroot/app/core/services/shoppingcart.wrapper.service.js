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
var Subject_1 = require("rxjs/Subject");
//import { SecurityService } from '../services/security.service';
var guid_1 = require("../common/guid");
var ShoppingCartWrapperService = /** @class */ (function () {
    function ShoppingCartWrapperService() {
        this.addItemToBasketSource = new Subject_1.Subject();
        this.addItemToBasket$ = this.addItemToBasketSource.asObservable();
        this.orderCreatedSource = new Subject_1.Subject();
        this.orderCreated$ = this.orderCreatedSource.asObservable();
    }
    ShoppingCartWrapperService.prototype.addItemToBasket = function (item) {
        var basket = {
            pictureUrl: item.pictureUri,
            productId: item.id,
            productName: item.name,
            quantity: 1,
            unitPrice: item.price,
            id: guid_1.Guid.newGuid(),
            oldUnitPrice: 0
        };
        this.addItemToBasketSource.next(basket);
    };
    ShoppingCartWrapperService.prototype.orderCreated = function () {
        this.orderCreatedSource.next();
    };
    ShoppingCartWrapperService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], ShoppingCartWrapperService);
    return ShoppingCartWrapperService;
}());
exports.ShoppingCartWrapperService = ShoppingCartWrapperService;
//# sourceMappingURL=shoppingcart.wrapper.service.js.map