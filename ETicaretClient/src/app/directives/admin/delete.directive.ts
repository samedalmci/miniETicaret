import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { ProductService } from '../../services/common/models/product.service';


declare var $: any;

@Directive({
  selector: '[appDelete]',
  standalone: false
})
export class DeleteDirective {

  constructor(
    private element: ElementRef,
    private _renderer: Renderer2,
    private productService: ProductService
  ) {

    const img = _renderer.createElement("img");
    img.setAttribute("src", "assets/images/delete.png");
    img.setAttribute("style", "cursor: pointer;");
    img.widht = 25;
    img.height = 25;
    _renderer.appendChild(element.nativeElement, img);
  }

  @Input() id: string;

  @HostListener("click")
  onclick() {
    const td: HTMLTableCellElement = this.element.nativeElement;
    this.productService.delete(this.id);    
    $(td.parentElement).fadeOut(2000);


  }

}
