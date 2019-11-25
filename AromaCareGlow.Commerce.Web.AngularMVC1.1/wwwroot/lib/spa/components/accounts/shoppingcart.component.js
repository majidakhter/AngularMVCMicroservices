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
var shoppingcart_service_1 = require("../../core/services/shoppingcart.service");
var shoppingcart_wrapper_service_1 = require("../../core/services/shoppingcart.wrapper.service");
var storage_service_1 = require("../../core/services/storage.service");
var ShoppingCartComponent = (function () {
    function ShoppingCartComponent(service, router, basketwrapper, storageservice) {
        this.service = service;
        this.router = router;
        this.basketwrapper = basketwrapper;
        this.storageservice = storageservice;
        this.basketItemCollection = new Array();
        this.totalPrice = 0;
    }
    ShoppingCartComponent.prototype.ngOnInit = function () {
        this.catalogItem = this.storageservice.retrieve('cartitem');
        for (var index = 0; index < this.catalogItem['items'].length; index++) {
            // this.basketItemCollection = [
            var obj = {
                id: this.catalogItem['items'][index].id,
                oldUnitPrice: this.catalogItem['items'][index].price,
                pictureUrl: this.catalogItem['items'][index].pictureUri,
                productId: '1021',
                productName: this.catalogItem['items'][index].name,
                quantity: this.catalogItem['items'][index].units,
                unitPrice: this.catalogItem['items'][index].price
            };
            this.basketItemCollection.push(obj);
            //];
        }
        this.basket = {
            'items': this.basketItemCollection,
            'buyerId': ''
        };
        this.calculateTotalPrice();
        //this.service.getBasket().subscribe(basket => {
        //    this.basket = basket;
        //    this.calculateTotalPrice();
        //});
    };
    ShoppingCartComponent.prototype.calculateTotalPrice = function () {
        var _this = this;
        this.totalPrice = 0;
        this.basket.items.forEach(function (item) {
            _this.totalPrice += (item.unitPrice * item.quantity);
        });
    };
    ShoppingCartComponent.prototype.checkOut = function (event) {
        var _this = this;
        this.update(event)
            .subscribe(function (x) {
            _this.errorMessages = [];
            _this.basketwrapper.basket = _this.basket;
            //this.router.navigate(['accounts/checkout']);
        });
        this.router.navigate(['accounts/checkout']);
    };
    ShoppingCartComponent.prototype.update = function (event) {
        var _this = this;
        var setBasketObservable = this.service.setBasket(this.basket);
        setBasketObservable.subscribe(function (x) {
            _this.errorMessages = [];
            console.log('basket updated: ' + x);
        }, function (errMessage) { return _this.errorMessages = errMessage.messages; });
        return setBasketObservable;
    };
    ShoppingCartComponent.prototype.itemQuantityChanged = function (item) {
        this.calculateTotalPrice();
        this.service.setBasket(this.basket).subscribe(function (x) { return console.log('basket updated: ' + x); });
    };
    ShoppingCartComponent = __decorate([
        core_1.Component({
            selector: 'order',
            templateUrl: './app/components/accounts/shoppingcart.component.html',
            styleUrls: ['./app/components/accounts/shoppingcart.component.css']
        }),
        __metadata("design:paramtypes", [shoppingcart_service_1.ShoppingCartService, router_1.Router, shoppingcart_wrapper_service_1.ShoppingCartWrapperService, storage_service_1.StorageService])
    ], ShoppingCartComponent);
    return ShoppingCartComponent;
}());
exports.ShoppingCartComponent = ShoppingCartComponent;
