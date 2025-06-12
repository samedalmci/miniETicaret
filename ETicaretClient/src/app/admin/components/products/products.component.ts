import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';


import { Create_Product } from '../../../contracts/create_product';
import { QrcodeReadingDialogComponent } from '../../../dialogs/qrcode-reading-dialog/qrcode-reading-dialog.component';
import { DialogService } from '../../../services/common/dialog.service';
import { ListComponent } from './list/list.component';
import { HttpClientService } from '../../../services/common/http-client.service';
import { BaseComponent } from '../../../base/base.component';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends BaseComponent implements OnInit {

  constructor(spinner: NgxSpinnerService, private httpClientService: HttpClientService, private dialogService: DialogService) {
    super(spinner)
  }

  ngOnInit(): void {

  }

  @ViewChild(ListComponent) listComponents: ListComponent;

  createdProduct(createdProduct: Create_Product) {
    this.listComponents.getProducts();
  }

  showProductQrCodeReading() {
    this.dialogService.openDialog({
      componentType: QrcodeReadingDialogComponent,
      data: null,
      options: {
        width: "1000px"
      },
      afterClosed: () => { }
    });
  }

}
