import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { SpinnerType } from '../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeleteDialogComponent, DeleteState } from '../../dialogs/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClientService } from '../../services/common/http-client.service';
import { AlertifyService, MessageType, Position } from '../../services/admin/alertify.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from '../../services/common/dialog.service';

declare var $: any;

@Directive({
  selector: '[appDelete]',
  standalone: false
})
export class DeleteDirective {

  constructor(
    private element: ElementRef,
    private _renderer: Renderer2,
    private httpClientService: HttpClientService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private alertifyService: AlertifyService,
    private dialogService : DialogService
  ) {}

  @Input() id: string;
  @Input() controller: string;
  @Output() callback: EventEmitter<any> = new EventEmitter();

  @HostListener("click")
  async onclick() {
    this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      data: DeleteState.Yes,
      afterClosed: async () => {
        this.spinner.show(SpinnerType.BallAtom);
        const td: HTMLTableCellElement = this.element.nativeElement;
        this.httpClientService.delete({
          controller: this.controller
        }, this.id).subscribe(data => {
          $(td.parentElement).animate({
            opacity: 0,
            left: "+50",
            height: "toogle"
          }, 700, () => {
            this.callback.emit();
            this.alertifyService.message(`${this.controller == 'roles' ? 'Rol' : 'Ürün'} başarıyla silinmiştir.`, {
              dismissOthers: true,
              messageType: MessageType.Success,
              position: Position.TopRight
            })
          });
        }, (errorResponse: HttpErrorResponse) => {
          this.spinner.hide(SpinnerType.BallAtom);
          this.alertifyService.message("Beklenmeyen bir hata ile karşılaşıldı!.", {
            dismissOthers: true,
            messageType: MessageType.Error,
            position: Position.TopRight
          })
        });
      }

    });
  }

  //openDialog(afterClosed: any): void {
  //  const dialogRef = this.dialog.open(DeleteDialogComponent, {
  //    width: '250px',
  //    data: DeleteState.Yes,
  //  });

  //  dialogRef.afterClosed().subscribe(result => {
  //    if (result == DeleteState.Yes) {    
  //      afterClosed();
  //    }
  //  });
  //}
}
