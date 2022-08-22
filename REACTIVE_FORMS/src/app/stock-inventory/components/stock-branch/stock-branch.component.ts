import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-stock-branch',
  templateUrl: './stock-branch.component.html',
  styleUrls: ['./stock-branch.component.scss']
})
export class StockBranchComponent {
  @Input()
  parent: FormGroup;

  constructor() { }

  get isInvalidBranch() {
    return (
      this.parent.get('store.branch')?.hasError('invalidBranch')
      && this.parent.get('store.branch')?.dirty
      && !this.isRequired('branch')
    );
  }

  get isBranchUnknown() {
    return (
      this.parent.get('store.branch')?.hasError('unknownBranch')
      && this.parent.get('store.branch')?.dirty
    );
  }

  isRequired(name: string) {
    return (
      this.parent.get(`store.${name}`)?.hasError('required')
      && this.parent.get(`store.${name}`)?.touched
    );
  }
}
