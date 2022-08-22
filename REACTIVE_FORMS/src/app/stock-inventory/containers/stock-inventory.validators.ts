import { AbstractControl, FormArray } from '@angular/forms';
import { Item } from '../models/item.interface';

export class StockInventoryValidators {
  static checkBranch(control: AbstractControl) {
    const pattern = /^[a-z]\d{3}$/i;
    const valid = pattern.test(control.value);

    return valid ? null : { invalidBranch: true };
  }

  static checkStockExists(control: AbstractControl) {
    const stock = control.get('stock');
    const selector = control.get('selector');

    if (!(stock && selector)) return null;

    const isStockExists = stock.value.some((stockItem: Item) => {
      return stockItem.product_id === parseInt(selector.value.product_id, 10);
    });

    return isStockExists ? { isStockExists: true } : null;
  }
}
