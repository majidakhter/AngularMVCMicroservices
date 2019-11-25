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
var shoppingcart_service_1 = require("../core/services/shoppingcart.service");
var HomeComponent = /** @class */ (function () {
    function HomeComponent(shoppingcartservice) {
        this.shoppingcartservice = shoppingcartservice;
    }
    HomeComponent.prototype.ngOnInit = function () {
        this.catalog = this.getCatalog();
    };
    HomeComponent.prototype.getCatalog = function () {
        this.catalogItem = this.getCatalogItems();
        var catalog = {
            pageIndex: 1,
            data: this.catalogItem,
            pageSize: 12,
            count: 9
        };
        return catalog;
    };
    HomeComponent.prototype.getCatalogItems = function () {
        var catalogItem = [
            {
                'id': '1',
                'name': 'Flamboyant Pink Top',
                'description': '',
                'price': 35.00,
                'pictureUri': '../../images/product/img1.jpg',
                'catalogBrandId': 101,
                'catalogBrand': 'Lakme',
                'catalogTypeId': 1001,
                'catalogType': 'Cosmetics',
                'units': 1
            },
            {
                'id': '2',
                'name': 'Flamboyant Pink Top',
                'description': '',
                'price': 37.00,
                'pictureUri': '../../images/product/img1.jpg',
                'catalogBrandId': 102,
                'catalogBrand': 'Himalaya',
                'catalogTypeId': 1002,
                'catalogType': 'Cosmetics',
                'units': 1
            },
            {
                'id': '3',
                'name': 'Flamboyant Pink Top',
                'description': '',
                'price': 39.00,
                'pictureUri': '../../images/product/img2.jpg',
                'catalogBrandId': 103,
                'catalogBrand': 'KyaSeth',
                'catalogTypeId': 1003,
                'catalogType': 'Cosmetics',
                'units': 1
            },
            {
                'id': '4',
                'name': 'Flamboyant Pink Top',
                'description': '',
                'price': 33.00,
                'pictureUri': '../../images/product/img5.jpg',
                'catalogBrandId': 104,
                'catalogBrand': 'Lotus',
                'catalogTypeId': 1004,
                'catalogType': 'Cosmetics',
                'units': 1
            },
            {
                'id': '5',
                'name': 'Flamboyant Pink Top',
                'description': '',
                'price': 31.00,
                'pictureUri': '../../images/product/img6.jpg',
                'catalogBrandId': 105,
                'catalogBrand': 'Ponds',
                'catalogTypeId': 1005,
                'catalogType': 'Cosmetics',
                'units': 1
            },
            {
                'id': '6',
                'name': 'Flamboyant Pink Top',
                'description': '',
                'price': 41.00,
                'pictureUri': '../../images/product/img1.jpg',
                'catalogBrandId': 106,
                'catalogBrand': 'Habeeb',
                'catalogTypeId': 1006,
                'catalogType': 'Cosmetics',
                'units': 1
            },
            {
                'id': '7',
                'name': 'Flamboyant Pink Top',
                'description': '',
                'price': 43.00,
                'pictureUri': '../../images/product/img2.jpg',
                'catalogBrandId': 107,
                'catalogBrand': 'ShahnazHussain',
                'catalogTypeId': 1007,
                'catalogType': 'Cosmetics',
                'units': 1
            },
            {
                'id': '8',
                'name': 'Flamboyant Pink Top',
                'description': '',
                'price': 45.00,
                'pictureUri': '../../images/product/img3.jpg',
                'catalogBrandId': 108,
                'catalogBrand': 'Femina',
                'catalogTypeId': 1008,
                'catalogType': 'Cosmetics',
                'units': 1
            },
            {
                'id': '9',
                'name': 'Flamboyant Pink Top',
                'description': '',
                'price': 47.00,
                'pictureUri': '../../images/product/img4.jpg',
                'catalogBrandId': 109,
                'catalogBrand': 'Faa',
                'catalogTypeId': 1009,
                'catalogType': 'Cosmetics',
                'units': 1
            }
        ];
        return catalogItem;
    };
    HomeComponent.prototype.addToCart = function (item) {
        this.shoppingcartservice.addItemToBasket(item);
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'home',
            templateUrl: './app/components/home.component.html'
        }),
        __metadata("design:paramtypes", [shoppingcart_service_1.ShoppingCartService])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map