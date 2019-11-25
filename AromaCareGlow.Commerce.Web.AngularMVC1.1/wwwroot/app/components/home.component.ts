import { Component, OnInit } from '@angular/core';
import { ICatalog } from '../core/domain/catalog.model';
import { ICatalogItem } from '../core/domain/catalogitem.model';
import { ShoppingCartService } from '../core/services/shoppingcart.service';
@Component({
    selector: 'home',
    templateUrl: './app/components/home.component.html'
})
export class HomeComponent implements OnInit {
    catalog: ICatalog;
    catalogItem: ICatalogItem[];
    constructor(private shoppingcartservice: ShoppingCartService) {

    }
    ngOnInit() {
        this.catalog = this.getCatalog();
    }
    getCatalog(): ICatalog {
        this.catalogItem = this.getCatalogItems();
        var catalog = {
            pageIndex: 1,
            data: this.catalogItem,
            pageSize: 12,
            count: 9
        }
        return catalog;
    }
    getCatalogItems(): ICatalogItem[] {
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
                'price':41.00,
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
          

        ]
        return catalogItem;
    }

    addToCart(item: ICatalogItem) {
        this.shoppingcartservice.addItemToBasket(item);
    }
}