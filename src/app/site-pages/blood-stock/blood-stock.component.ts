// blood-stock.component.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-blood-stock',
  templateUrl: './blood-stock.component.html',
  styleUrls: ['./blood-stock.component.css']
})
export class BloodStockComponent implements OnInit {
  productsWithElements: any[] = [];
  apiUrl = 'http://localhost:3000/api/v1/BloodBags';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (response: any) => {
        this.productsWithElements = this.groupByProduct(response.data);
      },
      (error: any) => {
        console.error('Error fetching blood bags:', error);
      }
    );
  }

  groupByProduct(bloodBags: any[]): any[] {
    const groupedProducts: any[] = [];

    // Group blood bags by product
    const groupedByProduct = bloodBags.reduce((acc, bloodBag) => {
      (acc[bloodBag.product] = acc[bloodBag.product] || []).push(bloodBag);
      return acc;
    }, {});

    // Convert grouped data into an array of objects
    for (const product in groupedByProduct) {
      if (groupedByProduct.hasOwnProperty(product)) {
        groupedProducts.push({ product, elements: groupedByProduct[product] });
      }
    }

    return groupedProducts;
  }
}
