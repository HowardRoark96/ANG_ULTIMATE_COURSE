import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { Product } from '../../models/product.interface';

@Component({
  selector: 'app-stock-products',
  templateUrl: './stock-products.component.html',
  styleUrls: ['./stock-products.component.scss']
})
export class StockProductsComponent {
  @Input()
  parent: FormGroup;

  @Input()
  map: Map<number, Product>;

  @Output()
  removed = new EventEmitter<any>();

  get stocks() {
    return (this.parent.get('stock') as FormArray).controls;
  }

  constructor() {
  }

  getProduct(id: number) {
    const product = this.map.get(id);

    return product || {name: '', price: 0, id: 0};
  }

  onRemove(group: AbstractControl<any>, index: number) {
    this.removed.emit({group, index});
  }
}
