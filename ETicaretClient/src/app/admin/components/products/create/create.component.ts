import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductService } from '../../../../services/common/models/product.service';
import { Create_Product } from '../../../../contracts/create_product';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { FileUploadOptions } from '../../../../services/common/file-upload/file-upload.component';

@Component({
  selector: 'app-create',
  standalone: false,
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent extends BaseComponent implements OnInit {

  constructor(spiner: NgxSpinnerService, private productService: ProductService, private alertify: AlertifyService) {
    super(spiner)
  }

  ngOnInit(): void {
  }

  @Output() createdProduct: EventEmitter<Create_Product> = new EventEmitter();
  @Output() fileUploadOptions: Partial<FileUploadOptions> = {
    action: "upload",
    controller: "products",
    explanation: "Resimleri Sürükleyin veya seçin...",
    isAdminPage: true,
    accept:".png, .jpg, .jpeg"
  }

  create(name: HTMLInputElement, stock: HTMLInputElement, price: HTMLInputElement) {
    // Frontend validasyonları
    if (!name.value || name.value.trim().length < 5 || name.value.trim().length > 150) {
      this.alertify.message("Ürün adı 5-150 karakter arasında olmalıdır.", {
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
      });
      return;
    }

    const stockValue = parseInt(stock.value);
    if (isNaN(stockValue) || stockValue < 0) {
      this.alertify.message("Stok bilgisi geçerli bir sayı olmalı ve negatif olamaz.", {
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
      });
      return;
    }

    const priceValue = parseFloat(price.value);
    if (isNaN(priceValue) || priceValue < 0) {
      this.alertify.message("Fiyat bilgisi geçerli bir sayı olmalı ve negatif olamaz.", {
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
      });
      return;
    }

    this.showSpinner(SpinnerType.BallAtom);
    const create_product: Create_Product = new Create_Product();
    create_product.name = name.value.trim();
    create_product.stock = stockValue;
    create_product.price = priceValue;

    this.productService.create(create_product, () => {
      this.hideSpinner(SpinnerType.BallAtom);
      this.alertify.message("Ürün Başarıyla Eklenmiştir.", {
        dismissOthers: true,
        messageType: MessageType.Success,
        position: Position.TopRight
      });
      this.createdProduct.emit(create_product);
      // Formu temizle
      name.value = '';
      stock.value = '0';
      price.value = '0';
    }, errorMessage => {
      this.hideSpinner(SpinnerType.BallAtom);
      this.alertify.message(errorMessage, {
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
      });
    });
  }

}
