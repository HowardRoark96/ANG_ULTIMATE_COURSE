import { Component, ElementRef, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { StockCounterComponent } from '../stock-counter/stock-counter.component';

const COUNTER_CONTROL_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => StockSelectComponent),
  multi: true
};

@Component({
  selector: 'app-stock-select',
  providers: [COUNTER_CONTROL_ACCESSOR],
  styleUrls: ['stock-select.component.scss'],
  templateUrl: 'stock-select.component.html'
})
export class StockSelectComponent implements ControlValueAccessor {
  private onModelChange: Function;
  private onTouch: Function;

  registerOnChange(fn: any) {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  writeValue(value: number) {
    if (!value) {
      this.selectedItem = { [this.displayItemProp]: 'Select'};
    }
  }

  selectedItem: any;
  isExpanded: boolean = false;

  @Input()
  itemList: any[];

  @Input()
  displayItemProp: string = 'name';

  constructor(
    private elRef: ElementRef
  ) {}

  onClickExpand(event: MouseEvent) {
    this.isExpanded = !this.isExpanded;
    event.preventDefault();
    event.stopPropagation();
    this.onTouch();
  }

  onClickOutside(event:  MouseEvent) {
    const targetElement = event.target;

    if (!this.elRef.nativeElement.contains(targetElement)) {
      this.isExpanded = false;
    }

    this.onTouch();
  }

  onSelectItem(selectedItem: any, index: number) {
    this.selectedItem = this.itemList[index];
    this.onModelChange(this.selectedItem.id);
    this.onTouch();
  }
}
