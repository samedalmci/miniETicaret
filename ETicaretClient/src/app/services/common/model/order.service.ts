import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { Create_Order } from '../../../contracts/order/create_order';
import { List_Order } from '../../../contracts/order/list_order';
import { HttpClientService } from '../http-client.service';
import { SingleOrder } from '../../../contracts/order/single_order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private httpCLientService: HttpClientService) { }

  async create(order: Create_Order): Promise<void> {
    const observable: Observable<any> = this.httpCLientService.post({
      controller: "orders"
    }, order);
    await firstValueFrom(observable);
  }

  async getAllOrders(page: number = 0, size: number = 5, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<{ TotalOrderCount: number; Orders: List_Order[] }> {
    const observable: Observable<{ TotalOrderCount: number; Orders: List_Order[] }> = this.httpCLientService.get({
      controller: "orders",
      queryString: `page=${page}&size=${size}`
    });

    const promiseData = firstValueFrom(observable);

    promiseData
      .then(value => {
        if (successCallBack) { // Callback kontrolü ekleyin
          successCallBack();
        }
      })
      .catch(error => {
        if (errorCallBack) { // Callback kontrolü ekleyin
          errorCallBack(error);
        }
      });

    return await promiseData;
  }

  async getOrderById(id: string, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<SingleOrder> {
    const observable: Observable<SingleOrder> = this.httpCLientService.get<SingleOrder>({
      controller: "orders"
    }, id);

    const promiseData = firstValueFrom(observable);

    promiseData
      .then(value => {
        if (successCallBack) { // Callback kontrolü ekleyin
          successCallBack();
        }
      })
      .catch(error => {
        if (errorCallBack) { // Callback kontrolü ekleyin
          errorCallBack(error);
        }
      });

    return await promiseData;
  }
}
