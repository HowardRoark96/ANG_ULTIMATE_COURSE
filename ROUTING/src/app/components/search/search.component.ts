import { Component, ElementRef, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

const CONTROL_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SearchComponent),
  multi: true
}

@Component({
  selector: 'app-search',
  providers: [CONTROL_ACCESSOR],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, ControlValueAccessor {
  private onModelChange: Function;
  private onTouch: Function;

  @Input() btnTitle: string = 'Search';
  @Input() selectProp: string = 'id';
  @Input() displayProp: string = 'name';
  @Input() noItemFoundTitle: string = 'No item was found.';
  @Input() searchFn: Function;
  @Input() isParentFormReset: BehaviorSubject<boolean>;

  selectedItems: any[] = [];
  inputValue: string = '';
  searchResult: any[] = [];
  isSearchResShown: boolean = false;
  maxHeightDropdown: string = '';

  registerOnChange(fn: any) {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  writeValue(value: any) {
    if (value === undefined)
      this.selectedItems = [];
    else {
      this.selectedItems = value;
    }
  }

  constructor(
    private fb: FormBuilder,
    private elRef: ElementRef
  ) { }

  ngOnInit() {
    this.isParentFormReset.subscribe(value => {
      if(value)
        this.inputValue = '';
    })
  }

  searchItem() {
    if(this.inputValue) {
      this.searchResult = this.searchFn(this.inputValue);

      this.searchResult = this.searchResult.filter(user => !this.selectedItems.includes(user));

      this.isSearchResShown = true;
    }
    else {
      this.searchResult = [];

      this.isSearchResShown = false;
    }

    this.onTouch();
  }

  onDeleteUser(event: Event, index: number) {
    this.selectedItems.splice(index, 1);
    this.elRef.nativeElement.querySelector('.search').focus();

    this.onModelChange(this.selectedItems);
    this.onTouch();
  }

  onClickOutside(event: Event) {
    const targetElement = event.target;

    if (!this.elRef.nativeElement.contains(targetElement))
      this.isSearchResShown = false;

    this.onTouch();
  }

  onFocus() {
    if(this.inputValue && this.searchResult.length > 0)
      this.isSearchResShown = true;

    if(this.inputValue) {
      this.searchItem();
    }

    this.onTouch();
  }

  onSelectItem(item: any) {
    this.selectedItems.push(item);
    this.isSearchResShown = false;
    this.inputValue = '';
    this.elRef.nativeElement.querySelector('.search').focus();

    this.onModelChange(this.selectedItems);
    this.onTouch();
  }
}
