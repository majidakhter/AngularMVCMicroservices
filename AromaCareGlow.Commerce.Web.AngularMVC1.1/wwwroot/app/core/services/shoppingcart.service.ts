import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Router } from '@angular/router';

import { IShoppingCart } from '../domain/shoppingcart.model';
import { ShoppingCartWrapperService } from './shoppingcart.wrapper.service';
import { DataService } from './data.service';
import { StorageService } from './storage.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
@Injectable()
export class ShoppingCartService {
    private basketUrl: string = '';
    private purchaseUrl: string = '';
    basket: IShoppingCart = {
        buyerId: '',
        items: []
    };
    private basketDropedSource = new Subject();
    basketDroped$ = this.basketDropedSource.asObservable();
    constructor(private dataservice:DataService,private basketEvents: ShoppingCartWrapperService, private router: Router, private storageService: StorageService) {
        this.basket.items = [];
    }
    addItemToBasket(item: any): Observable<boolean> {
        this.basket.items.push(item);
        return this.setBasket(this.basket);
    }
    setBasket(basket:any): Observable<boolean> {
        let url = this.purchaseUrl + '/api/v1/basket/';
        this.basket = basket;
        this.storageService.store('cartitem', basket);
        return this.dataservice.post(url, basket).pipe(map((response: any) => {
            return true;
        }));
    }
    getBasket(): Observable<IShoppingCart> {
        let url = this.basketUrl + '/api/v1/b/basket/' + this.basket.buyerId;
        return this.dataservice.getResponse(url).pipe(map((response: any) => {
            if (response.status === 204) {
                return null;
            }
            return response;
        }));
    }    
}