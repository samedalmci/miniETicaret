import { CUSTOM_ELEMENTS_SCHEMA, NgModule, PLATFORM_ID, Inject } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './admin/admin.module';
import { UiModule } from './ui/ui.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { LoginComponent } from './ui/components/login/login.component';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { HttpErrorHandlerInterceptorService } from './services/common/http-error-handler-interceptor.service';
import { isPlatformBrowser } from '@angular/common';
import { DynamicLoadComponentDirective } from './directives/common/dynamic-load-component.directive';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DynamicLoadComponentDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AdminModule,UiModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: function() {
          if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem("accessToken");
          }
          return null;
        },
        allowedDomains: ["localhost:5216"]
      }
    }),
    SocialLoginModule
  ],
  exports: [
    AdminModule
  ],
  providers: [
    { provide: "baseUrl", useValue: "http://localhost:5216/api", multi: true },
    provideHttpClient(withFetch()),
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider("932674286640-f77tle1pkpva3ce33lmui9fbsqobutvj.apps.googleusercontent.com", {
              oneTapEnabled: false,
              prompt: 'select_account',
            })
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider("687915383831988", {
              scope: 'email,public_profile'
            })
          }
        ],
        onError: err => console.log(err)
      } as SocialAuthServiceConfig
    },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorHandlerInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [    
    CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { 
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
}
