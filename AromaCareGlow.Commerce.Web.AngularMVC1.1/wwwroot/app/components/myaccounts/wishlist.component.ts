import { Component } from '@angular/core';
import { Product } from '../../core/domain/product';
@Component({
    selector: 'order',
    templateUrl: './app/components/myaccounts/wishlist.component.html',
    styleUrls: ['./app/components/myaccounts/wishlist.component.css']
})
export class WishListComponent {
    productCollection: Array<Product> = new Array<Product>();
    product1: Product;
    product2: Product;
    product3: Product;
    constructor() {

    }
    ngOnInit() {
        this.product1 = new Product('../../images/cart/1.jpg', 'Nullam maximus', '$23.39', 'in stock');
        this.product2 = new Product('../../images/cart/2.jpg', 'Natus erro', '$30.50', 'in stock');
        this.product3 = new Product('../../images/cart/3.jpg', 'Sit voluptatem', '$40.19', 'out stock');
        this.productCollection.push(this.product1);
        this.productCollection.push(this.product2);
        this.productCollection.push(this.product3);
    }
}