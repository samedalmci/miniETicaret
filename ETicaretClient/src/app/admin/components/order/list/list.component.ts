import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { List_Order } from '../../../../contracts/order/list_order';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { OrderService } from '../../../../services/common/model/order.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule]
})
export class ListComponent extends BaseComponent implements OnInit, AfterViewInit {
  constructor(
    spinner: NgxSpinnerService,
    private orderService: OrderService,
    private alertifyService: AlertifyService
  ) {
    super(spinner);
  }

  displayedColumns: string[] = ['OrderCode', 'UserName', 'TotalPrice', 'CreatedDate', 'Delete'];
  dataSource: MatTableDataSource<List_Order> = new MatTableDataSource<List_Order>([]);
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  async ngOnInit() {
    // İlk yükleme
    await this.getOrders();
  }

  ngAfterViewInit() {
    // ViewChild'ları ayarla
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async getOrders() {
    this.showSpinner(SpinnerType.BallAtom);
    
    try {
      console.log('Calling getAllOrders...');
      
      const allOrders: any = 
        await this.orderService.getAllOrders(
          this.paginator ? this.paginator.pageIndex : 0, 
          this.paginator ? this.paginator.pageSize : 5, 
          () => this.hideSpinner(SpinnerType.BallAtom), 
          errorMessage => this.alertifyService.message(errorMessage, {
            dismissOthers: true,
            messageType: MessageType.Error,
            position: Position.TopRight
          })
        );

      console.log('Raw API Response:', allOrders);
      console.log('Orders array:', allOrders?.Orders);
      console.log('Orders length:', allOrders?.Orders?.length);
      console.log('Total count:', allOrders?.TotalOrderCount);
      
      // Veri kontrolü
      if (allOrders && allOrders.Orders) {
        console.log('Setting dataSource with orders:', allOrders.Orders);
        this.dataSource.data = allOrders.Orders;
        
        // Paginator'ı ayarla
        if (this.paginator) {
          this.paginator.length = allOrders.TotalOrderCount || 0;
        }
        
        console.log('DataSource after setting:', this.dataSource.data);
      } else {
        console.warn('No orders data received');
        this.dataSource.data = [];
      }
      
    } catch (error) {
      console.error('Error loading orders:', error);
      this.dataSource.data = [];
      this.hideSpinner(SpinnerType.BallAtom);
    }
  }
  async pageChanged() {
    await this.getOrders();
  }
}


