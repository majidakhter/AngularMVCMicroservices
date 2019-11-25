import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ICatalogItem } from '../domain/catalogitem.model';
import { IShoppingCartItem } from '../domain/shoppingcartitem.model';
import { IShoppingCart } from '../domain/shoppingcart.model';
//import { SecurityService } from '../services/security.service';
import { Guid } from '../common/guid';

@Injectable()
export class ShoppingCartWrapperService {
    public basket: IShoppingCart;
    constructor() {

    }
    private addItemToBasketSource = new Subject<IShoppingCartItem>();
    addItemToBasket$ = this.addItemToBasketSource.asObservable();

    private orderCreatedSource = new Subject();
    orderCreated$ = this.orderCreatedSource.asObservable();
    addItemToBasket(item: ICatalogItem) {
       
            let basket: IShoppingCartItem = {
                pictureUrl: item.pictureUri,
                productId: item.id,
                productName: item.name,
                quantity: 1,
                unitPrice: item.price,
                id: Guid.newGuid(),
                oldUnitPrice: 0
            };

            this.addItemToBasketSource.next(basket);
      
    }

    orderCreated() {
        this.orderCreatedSource.next();
    }
}