import { Component, OnInit } from '@angular/core';
import { FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Product } from '../models/product.interface';
import { StockInventoryService } from '../services/stock-inventory.service';
import { forkJoin, map } from 'rxjs';
import { Item } from '../models/item.interface';
import { StockInventoryValidators } from './stock-inventory.validators';
import { Branch } from '../models/branch.interface';

@Component({
  selector: 'app-stock-inventory',
  styleUrls: ['stock-inventory.component.scss'],
  templateUrl: 'stock-inventory.component.html'
})
export class StockInventoryComponent implements OnInit {
  products: Product[];
  branches: Branch[];

  productMap: Map<number, Product>;

  totalPrice: number;

  form = this.fb.group({
    store: this.fb.group({
      branch: ['', [Validators.required, StockInventoryValidators.checkBranch], [this.validateBranch.bind(this)]],
      code: ['', Validators.required]
    }),
    selector: this.createStock({}),
    stock: this.fb.array([])
  }, { validators: StockInventoryValidators.checkStockExists });

  constructor(
    private fb: FormBuilder,
    private stockService: StockInventoryService
  ) { }

  ngOnInit() {
    const cart = this.stockService.getCartItems();
    const products = this.stockService.getProducts();
    const branches = this.stockService.getBranchesId();

    forkJoin(
      cart,
      products,
      branches
    ).subscribe(([cart, products, branches]: [Item[], Product[], Branch[]]) => {
      const mapped = products.map<[number, Product]>(product => [product.id, product]);

      this.productMap = new Map<number, Product>(mapped);
      this.products = products;
      this.branches = branches;

      cart.forEach(item => this.addStock(item));

      this.calculateTotalPrice(this.form.get('stock')?.value as Item[]);
      this.form.get('stock')?.valueChanges
        .subscribe(value => this.calculateTotalPrice(value as Item[]));
    });
  }

  onSubmit() {
    console.log(this.form.value);
  }

  validateBranch(control: AbstractControl) {
    return this.stockService.checkBranchId(control.value).pipe(
      map(res => res ? null : { unknownBranch: true})
    );
  }

  createStock(stock: any) {
    return this.fb.group({
      product_id: parseInt(stock.product_id, 10) || '',
      quantity: parseInt(stock.quantity, 10) || 5
    });
  }

  addStock(stock: any) {
    const control = this.form.get('stock') as FormArray;

    control.push(this.createStock(stock));
  }

  removeStock(removedStock: { group: AbstractControl<any>, index: number }) {
    const control = this.form.get('stock') as FormArray;

    control.removeAt(removedStock.index);
  }

  calculateTotalPrice(stock: Item[]) {
    const result = stock.reduce((prev, next) => {
      return prev + (next.quantity * (this.productMap.get(next.product_id) as Product).price)
    }, 0);

    this.totalPrice = result;
  }
}
