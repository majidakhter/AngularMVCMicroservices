import { Component,OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../../core/services/shoppingcart.service';
import { IShoppingCart } from '../../core/domain/shoppingcart.model';
import { ICatalogItem } from '../../core/domain/catalogitem.model';
import { IShoppingCartItem } from '../../core/domain/shoppingcartitem.model';
import { ShoppingCartWrapperService } from '../../core/services/shoppingcart.wrapper.service';
import { StorageService } from '../../core/services/storage.service';
@Component({
    selector: 'order',
    templateUrl: './app/components/accounts/shoppingcart.component.html',
    styleUrls: ['./app/components/accounts/shoppingcart.component.css']
})
export class ShoppingCartComponent implements OnInit {

    errorMessages: any;
    basket: IShoppingCart;
    catalogItem: ICatalogItem;
    basketItem: IShoppingCartItem;
    basketItemCollection: IShoppingCartItem[] = new Array<IShoppingCartItem>();
    totalPrice: number = 0;

    constructor(private service: ShoppingCartService, private router: Router, private basketwrapper: ShoppingCartWrapperService, private storageservice: StorageService) {

    }
    ngOnInit() {
        this.catalogItem = this.storageservice.retrieve('cartitem');
        for (let index = 0; index < this.catalogItem['items'].length; index++) {
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
            'buyerId':''
        
         }
        this.calculateTotalPrice();
        //this.service.getBasket().subscribe(basket => {
        //    this.basket = basket;
        //    this.calculateTotalPrice();
        //});
    }
    private calculateTotalPrice() {
        this.totalPrice = 0;
        this.basket.items.forEach(item => {
            this.totalPrice += (item.unitPrice * item.quantity);
        });
    }

    checkOut(event:any) {
        this.update(event)
            .subscribe(
                x => {
                    this.errorMessages = [];
                    this.basketwrapper.basket = this.basket;
                    //this.router.navigate(['accounts/checkout']);
            });
        this.router.navigate(['accounts/checkout']);
    }
    update(event: any): Observable<boolean> {
        let setBasketObservable = this.service.setBasket(this.basket);
        setBasketObservable.subscribe(x => {
            this.errorMessages = [];
            console.log('basket updated: ' + x);
        },
            errMessage => this.errorMessages = errMessage.messages);
        return setBasketObservable;
    }
    itemQuantityChanged(item: IShoppingCartItem) {
        this.calculateTotalPrice();
        this.service.setBasket(this.basket).subscribe(x => console.log('basket updated: ' + x));
    }
}