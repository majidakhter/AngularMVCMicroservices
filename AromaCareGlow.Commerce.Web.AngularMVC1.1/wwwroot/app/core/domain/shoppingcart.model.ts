import { IShoppingCartItem } from './shoppingcartitem.model';

export interface IShoppingCart {
    items: IShoppingCartItem[];
    buyerId: string;
}
