import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { List_Order } from '../../../../contracts/order/list_order';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { OrderService } from '../../../../services/common/model/order.service';
import { DialogService } from '../../../../services/common/dialog.service';
import { OrderDetailDialogComponent } from '../../../../dialogs/order-detail-dialog/order-detail-dialog.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: false
})
export class ListComponent extends BaseComponent implements OnInit {
  constructor(spinner: NgxSpinnerService,
    private orderService: OrderService,
    private alertifyService: AlertifyService,
    private dialogService: DialogService) {
    super(spinner)
  }

  displayedColumns: string[] = ['OrderCode', 'UserName', 'TotalPrice', 'CreatedDate',"Completed" ,"Viewdetail" ,'Delete'];
  dataSource: MatTableDataSource<List_Order> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  async getOrders() {
    this.showSpinner(SpinnerType.BallAtom);
    console.log('Getting orders...');

    try {
      const allOrders: { TotalOrderCount: number; Orders: List_Order[] } = await this.orderService.getAllOrders(
        this.paginator ? this.paginator.pageIndex : 0,
        this.paginator ? this.paginator.pageSize : 5,
        () => {
          console.log('Orders loaded successfully');
          this.hideSpinner(SpinnerType.BallAtom);
        },
        errorMessage => {
          console.error('Error loading orders:', errorMessage);
          this.alertifyService.message(errorMessage, {
            dismissOthers: true,
            messageType: MessageType.Error,
            position: Position.TopRight
          });
        }
      );

      console.log('Orders data:', allOrders);
      console.log('First order:', allOrders.Orders[0]);
      this.dataSource = new MatTableDataSource<List_Order>(allOrders.Orders);
      if (this.paginator) {
        this.paginator.length = allOrders.TotalOrderCount;
      }
    } catch (error) {
      console.error('Error in getOrders:', error);
      this.hideSpinner(SpinnerType.BallAtom);
    }
  }

  async pageChanged() {
    await this.getOrders();
  }

  async ngOnInit() {
    await this.getOrders();
  }

  showDetail(Id: string) {
    this.dialogService.openDialog({
      componentType: OrderDetailDialogComponent,
      data: Id,
      options: {
        width: "750px"
      }
    });
  }
} 
