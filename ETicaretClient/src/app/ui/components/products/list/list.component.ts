import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseUrl } from '../../../../contracts/base_url';
import { List_Product } from '../../../../contracts/list_product';
import { FileService } from '../../../../services/common/model/file.service';
import { ProductService } from '../../../../services/common/model/product.service';

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {

  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute, private fileService: FileService) { }

  currentPageNo: number;
  totalProductCount: number;
  totalPageCount: number;
  pageSize: number = 12;
  pageList: number[] = [];
  baseUrl: string = "http://localhost:5216";

  products: List_Product[];
  async ngOnInit() {
    this.activatedRoute.params.subscribe(async params => {
      this.currentPageNo = parseInt(params["pageNo"] ?? 1);

      const data: { totalProductCount: number, products: List_Product[] } = await this.productService.read(this.currentPageNo - 1, this.pageSize,
        () => {},
        errorMessage => {});

      this.products = data.products;

      this.products = this.products.map<List_Product>(p => {
        const showcaseImage = p.ProductImageFiles?.find(p => p.Showcase);
        const listProduct: List_Product = {
          Id: p.Id,
          CreatedDate: p.CreatedDate,
          ImagePath: showcaseImage ? showcaseImage.Path : "",
          Name: p.Name,
          Price: p.Price,
          Stock: p.Stock,
          UpdateDate: p.UpdateDate,
          ProductImageFiles: p.ProductImageFiles
        };

        return listProduct;
      });

      this.totalProductCount = data.totalProductCount;
      this.totalPageCount = Math.ceil(this.totalProductCount / this.pageSize);

      this.pageList = [];

      if (this.currentPageNo - 3 <= 0)
        for (let i = 1; i <= 7; i++)
          this.pageList.push(i);
      else if (this.currentPageNo + 3 >= this.totalPageCount)
        for (let i = this.totalPageCount - 6; i <= this.totalPageCount; i++)
          this.pageList.push(i);
      else
        for (let i = this.currentPageNo - 3; i <= this.currentPageNo + 3; i++)
          this.pageList.push(i);
    });
  }
}
    
