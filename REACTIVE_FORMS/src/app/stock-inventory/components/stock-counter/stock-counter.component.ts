import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const COUNTER_CONTROL_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => StockCounterComponent),
  multi: true
};

@Component({
  selector: 'app-stock-counter',
  providers: [COUNTER_CONTROL_ACCESSOR],
  styleUrls: ['stock-counter.component.scss'],
  templateUrl: 'stock-counter.component.html'
})
export class StockCounterComponent implements ControlValueAccessor {
  @Input() step: number = 5;
  @Input() min: number = 5;
  @Input() max: number = 100;

  private onModelChange: Function;
  private onTouch: Function;

  registerOnChange(fn: any) {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  writeValue(value: number) {
    this.value = value;
  }

  value: number = 5;
  focus: boolean;

  constructor() { }

  increment() {
    if(this.value < this.max) {
      this.value = this.value + this.step;
      this.onModelChange(this.value);
    }

    this.onTouch();
  }

  decrement() {
    if(this.value > this.min) {
      this.value = this.value - this.step;
      this.onModelChange(this.value);
    }

    this.onTouch();
  }

  onKeyDown(event: KeyboardEvent) {
    const handlers = {
      ArrowDown: () => this.decrement(),
      ArrowUp: () => this.increment()
    };

    if ((handlers as any)[event.code]) {
      (handlers as any)[event.code]();
      event.preventDefault();
      event.stopPropagation();
    }

    this.onTouch();
  }

  onBlur(event: FocusEvent) {
    this.focus = false;

    event.preventDefault();
    event.stopPropagation();
    this.onTouch();
  }

  onFocus(event: FocusEvent) {
    this.focus = true;

    event.preventDefault();
    event.stopPropagation();
    this.onTouch();
  }
}
