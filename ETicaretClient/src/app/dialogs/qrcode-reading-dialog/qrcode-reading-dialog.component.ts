import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base.component';
import { ProductService } from '../../services/common/model/product.service';
import { QrCodeService } from '../../services/common/qr-code.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../services/ui/custom-toastr.service';
import { BaseDialog } from '../base/base-dialog';

declare var $: any;

@Component({
  selector: 'app-qrcode-reading-dialog',
  standalone: false,
  templateUrl: './qrcode-reading-dialog.component.html'
})
export class QrcodeReadingDialogComponent extends BaseDialog<QrcodeReadingDialogComponent> implements OnInit, OnDestroy {

  constructor(
    dialogRef: MatDialogRef<QrcodeReadingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private spinner: NgxSpinnerService,
    private toastrService: CustomToastrService,
    private productService: ProductService) {
    super(dialogRef)
  }

  @ViewChild("scanner", { static: true }) scanner: NgxScannerQrcodeComponent;
  @ViewChild("txtStock", { static: true }) txtStock: ElementRef;

  ngOnInit(): void {
    this.scanner.start();
  }

  ngOnDestroy(): void {
    this.scanner.stop();
  }

  onEvent(e) {
    try {
      this.spinner.show(SpinnerType.BallAtom);
      const data: any = (e as { data: string }).data;
      
      console.log("QR Kod içeriği:", data);
      
      if (!data) {
        this.toastrService.message("QR kod okunamadı. Lütfen tekrar deneyin.", "Hata", {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        });
        this.spinner.hide(SpinnerType.BallAtom);
        return;
      }

      let jsonData;
      try {
        jsonData = JSON.parse(data);
        console.log("Parse edilmiş JSON:", jsonData);
      } catch (error) {
        console.error("JSON parse hatası:", error);
        this.toastrService.message("Geçersiz QR kod formatı. Lütfen doğru QR kodu okutun.", "Hata", {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        });
        this.spinner.hide(SpinnerType.BallAtom);
        return;
      }

      if (!jsonData.Id || !jsonData.Name) {
        this.toastrService.message("QR kod içeriği eksik. Lütfen doğru QR kodu okutun.", "Hata", {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        });
        this.spinner.hide(SpinnerType.BallAtom);
        return;
      }

      const stockValue = (this.txtStock.nativeElement as HTMLInputElement).value;
      if (!stockValue || isNaN(parseInt(stockValue))) {
        this.toastrService.message("Lütfen geçerli bir stok değeri girin.", "Hata", {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        });
        this.spinner.hide(SpinnerType.BallAtom);
        return;
      }

      this.productService.updateStockQrCodeToProduct(jsonData.Id, parseInt(stockValue), () => {
        $("#btnClose").click();
        this.toastrService.message(`${jsonData.Name} ürünün stok bilgisi '${stockValue}' olarak güncellenmiştir.`, "Stok Başarıyla Güncellendi", {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.TopRight
        });
        this.spinner.hide(SpinnerType.BallAtom);
      });
    } catch (error) {
      this.toastrService.message("Bir hata oluştu: " + error, "Hata", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      });
      this.spinner.hide(SpinnerType.BallAtom);
    }
  }
}
