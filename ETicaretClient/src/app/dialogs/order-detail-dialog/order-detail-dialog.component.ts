import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SingleOrder } from '../../contracts/order/single_order';
import { OrderService } from '../../services/common/model/order.service';
import { DialogService } from '../../services/common/dialog.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../services/ui/custom-toastr.service';
import { CompleteOrderDialogComponent, CompleteOrderState } from '../complete-order-dialog/complete-order-dialog.component';
import { SpinnerType } from '../../base/base.component';

@Component({
  selector: 'app-order-detail-dialog',
  standalone: false,
  templateUrl: './order-detail-dialog.component.html',
  styleUrl: './order-detail-dialog.component.scss'
})
export class OrderDetailDialogComponent extends BaseDialog<OrderDetailDialogComponent> implements OnInit {

  constructor(
    dialogRef: MatDialogRef<OrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderDetailDialogState | string,
    private orderService: OrderService,
    private dialogService: DialogService,
    private spinner: NgxSpinnerService,
    private toastrService: CustomToastrService) {
    super(dialogRef)
  }

  singleOrder: SingleOrder | null = null; // Initialize with null
  displayedColumns: string[] = ['Name', 'Price', 'Quantity', 'TotalPrice'];
  dataSource = [];
  clickedRows = new Set<any>();
  totalPrice: number = 0;

  async ngOnInit(): Promise<void> {
    try {
      console.log('Loading order with ID:', this.data);
      this.singleOrder = await this.orderService.getOrderById(
        this.data as string,
        () => {
          console.log('Order loaded successfully');
        },
        (error) => {
          console.error('Error loading order:', error);
        }
      );
      if (this.singleOrder && this.singleOrder.BasketItems) {
        this.dataSource = this.singleOrder.BasketItems;
        this.totalPrice = this.singleOrder.BasketItems
          .map((basketItem) => basketItem.Price * basketItem.Quantity)
          .reduce((price, current) => price + current, 0);
      }
      console.log('Single order loaded:', this.singleOrder);
      console.log('Completed status:', this.singleOrder?.Completed); // BU SATIRUI EKLE
    } catch (error) {
      console.error('Error in ngOnInit:', error);
    }
  }

  completeOrder() {
    this.dialogService.openDialog({
      componentType: CompleteOrderDialogComponent,
      data: CompleteOrderState.Yes,
      afterClosed: async () => {
        this.spinner.show(SpinnerType.BallAtom)
        await this.orderService.completeOrder(this.data as string);
        this.spinner.hide(SpinnerType.BallAtom)
        this.toastrService.message("Sipariş başarıyla tamamlanmıştır! Müşteriye bilgi verilmiştir.", "Sipariş Tamamlandı!", {
          messageType: ToastrMessageType.Success, 
          position: ToastrPosition.TopRight
        });
      }
    });
  }
}

export enum OrderDetailDialogState {
  Close,
  OrderComplete
}
