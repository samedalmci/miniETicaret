import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
declare var alertify: any

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  message(message: string, options: Partial<AlertifyOptions>) {   
    if (isPlatformBrowser(this.platformId)) {
      alertify.set('notifier', 'delay', options.delay);
      alertify.set('notifier', 'position', options.position);  
      const msj = alertify[options.messageType](message);
      if(options.dismissOthers)
        msj.dismissOthers();
    }
  }

  dismiss(){
    if (isPlatformBrowser(this.platformId)) {
      alertify.dismissAll();
    }
  }
}

export class AlertifyOptions{
  message : string;
  messageType : MessageType = MessageType.Message; 
  position : Position = Position.BottomLeft;
  delay: Number = 3;
  dismissOthers: boolean = false;

}

export enum MessageType{
  Error = "error",
  Message = "message" ,
  Notify = "notify",
  Success = "success",
  Warning = "warning"
}


export enum Position{
  TopRight = "top-right",
  TopLeft = "top-left",
  TopCenter = "top-center",
  BottomRight = "bottom-right",
  BottomLeft = "bottom-left",
  BottomCenter = "bottom-center"
}



  
