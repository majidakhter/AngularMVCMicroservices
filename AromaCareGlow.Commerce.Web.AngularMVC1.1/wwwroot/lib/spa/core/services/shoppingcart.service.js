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
var router_1 = require("@angular/router");
var shoppingcart_wrapper_service_1 = require("./shoppingcart.wrapper.service");
var data_service_1 = require("./data.service");
var storage_service_1 = require("./storage.service");
var Subject_1 = require("rxjs/Subject");
var operators_1 = require("rxjs/operators");
var ShoppingCartService = (function () {
    function ShoppingCartService(dataservice, basketEvents, router, storageService) {
        this.dataservice = dataservice;
        this.basketEvents = basketEvents;
        this.router = router;
        this.storageService = storageService;
        this.basketUrl = '';
        this.purchaseUrl = '';
        this.basket = {
            buyerId: '',
            items: []
        };
        this.basketDropedSource = new Subject_1.Subject();
        this.basketDroped$ = this.basketDropedSource.asObservable();
        this.basket.items = [];
    }
    ShoppingCartService.prototype.addItemToBasket = function (item) {
        this.basket.items.push(item);
        return this.setBasket(this.basket);
    };
    ShoppingCartService.prototype.setBasket = function (basket) {
        var url = this.purchaseUrl + '/api/v1/basket/';
        this.basket = basket;
        this.storageService.store('cartitem', basket);
        return this.dataservice.post(url, basket).pipe(operators_1.map(function (response) {
            return true;
        }));
    };
    ShoppingCartService.prototype.getBasket = function () {
        var url = this.basketUrl + '/api/v1/b/basket/' + this.basket.buyerId;
        return this.dataservice.getResponse(url).pipe(operators_1.map(function (response) {
            if (response.status === 204) {
                return null;
            }
            return response;
        }));
    };
    ShoppingCartService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [data_service_1.DataService, shoppingcart_wrapper_service_1.ShoppingCartWrapperService, router_1.Router, storage_service_1.StorageService])
    ], ShoppingCartService);
    return ShoppingCartService;
}());
exports.ShoppingCartService = ShoppingCartService;
