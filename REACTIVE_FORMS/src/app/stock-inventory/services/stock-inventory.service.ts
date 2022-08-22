import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { Product } from '../models/product.interface';
import { Item } from '../models/item.interface';
import { Branch } from '../models/branch.interface';


@Injectable()
export class StockInventoryService {

  constructor(
    private http: HttpClient
  ) {}

  getCartItems(): Observable<Item[]> {
    return this.http
      .get<Item[]>('http://localhost:3000/cart')
      .pipe(
        catchError(error => {
          throw 'error in source. Details: ' + error;
        })
      );
  }

  getProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>('http://localhost:3000/products')
      .pipe(
        catchError(error => {
          throw 'error in source. Details: ' + error;
        })
      );
  }

  getBranchesId(): Observable<Branch[]> {
    return this.http
      .get<Branch[]>('http://localhost:3000/branches')
      .pipe(
        catchError(error => {
          throw 'error in source. Details: ' + error;
        })
      );
  }

  checkBranchId(id: string): Observable<boolean> {
    let search = new HttpParams();

    search = search.append("id", id);

    return this.http
      .get<[]>('http://localhost:3000/branches', { params: search })
      .pipe(
        map(res => !!res.length),
        catchError(error => {
          throw 'error in source. Details: ' + error;
        })
      )
  }

}
