import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseDialog } from '../base/base-dialog';

declare var $: any;

@Component({
  selector: 'app-shoping-complete-dialog',
  standalone: false,
  templateUrl: './shoping-complete-dialog.component.html',
  styleUrl: './shoping-complete-dialog.component.scss'
})
export class ShoppingCompleteDialogComponent extends BaseDialog<ShoppingCompleteDialogComponent> implements OnDestroy {

  constructor(dialogRef: MatDialogRef<ShoppingCompleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShoppingCompleteState) {
    super(dialogRef)
  }

  show: boolean = false;
  complete() {
    this.show = true;
  }

  ngOnDestroy(): void {
    if (!this.show)
      $("#basketModal").modal("show");
  }
}

export enum ShoppingCompleteState {
  Yes,
  No
}
