import { Component, ElementRef, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const COUNTER_CONTROL_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectorComponent),
  multi: true
};

@Component({
  selector: 'app-selector',
  providers: [COUNTER_CONTROL_ACCESSOR],
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent implements ControlValueAccessor {
  private onModelChange: Function;
  private onTouch: Function;

  @Input() itemList: any[];
  @Input() selectProp: string = 'id';
  @Input() displayProp: string = 'name';
  @Input() maxHeightDropdown: string;

  selectedItem: any;
  isExpanded: boolean = false;

  registerOnChange(fn: any) {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  writeValue(value: any) {
    if (value === undefined)
      this.selectedItem = { [this.displayProp]: 'Select'};
    else {
      this.selectedItem = this.itemList[value];
    }

  }

  constructor(
    private elRef: ElementRef
  ) { }

  onClickExpand(event: MouseEvent) {
    this.isExpanded = !this.isExpanded;
    event.preventDefault();
    event.stopPropagation();
    this.onTouch();
  }

  onClickOutside(event:  MouseEvent) {
    const targetElement = event.target;

    if (!this.elRef.nativeElement.contains(targetElement))
      this.isExpanded = false;

    this.onTouch();
  }

  onSelectItem(selectedItem: any, index: number) {
    this.selectedItem = this.itemList[index];
    this.onModelChange(this.selectedItem[this.selectProp]);
    this.onTouch();
  }
}
