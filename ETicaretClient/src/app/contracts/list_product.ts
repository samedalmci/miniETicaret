import { List_Product_Images } from "./list_product_images";

export class List_Product {
  Id: string;
  Name: string;
  Stock: number;
  Price: number;
  CreatedDate: Date;
  UpdateDate: Date;
  ProductImageFiles?: List_Product_Images[];
  ImagePath: string;
}
