export class Product {
    ImageSource: string;
    ProductName: string;
    ProductPrice: string;
    ProductStockStatus: string;
    constructor(imgsrc: string, productname: string, price: string, stockstatus: string) {
        this.ImageSource = imgsrc;
        this.ProductName = productname;
        this.ProductPrice = price;
        this.ProductStockStatus = stockstatus;

    }
}