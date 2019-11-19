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
var product_1 = require("../../core/domain/product");
var WishListComponent = (function () {
    function WishListComponent() {
        this.productCollection = new Array();
    }
    WishListComponent.prototype.ngOnInit = function () {
        this.product1 = new product_1.Product('../../images/cart/1.jpg', 'Nullam maximus', '$23.39', 'in stock');
        this.product2 = new product_1.Product('../../images/cart/2.jpg', 'Natus erro', '$30.50', 'in stock');
        this.product3 = new product_1.Product('../../images/cart/3.jpg', 'Sit voluptatem', '$40.19', 'out stock');
        this.productCollection.push(this.product1);
        this.productCollection.push(this.product2);
        this.productCollection.push(this.product3);
    };
    WishListComponent = __decorate([
        core_1.Component({
            selector: 'order',
            templateUrl: './app/components/myaccounts/wishlist.component.html',
            styleUrls: ['./app/components/myaccounts/wishlist.component.css']
        }),
        __metadata("design:paramtypes", [])
    ], WishListComponent);
    return WishListComponent;
}());
exports.WishListComponent = WishListComponent;
