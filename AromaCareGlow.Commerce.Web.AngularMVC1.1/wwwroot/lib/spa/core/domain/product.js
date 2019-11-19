"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Product = (function () {
    function Product(imgsrc, productname, price, stockstatus) {
        this.ImageSource = imgsrc;
        this.ProductName = productname;
        this.ProductPrice = price;
        this.ProductStockStatus = stockstatus;
    }
    return Product;
}());
exports.Product = Product;
