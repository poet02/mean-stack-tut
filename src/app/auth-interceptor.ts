import { AuthService } from './auth/auth.service';
import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}


  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();

    //manipulate to hold token, directly edit outgoing req can face side effects
    const authRequest = req.clone({//set
      headers: req.headers.set("Authorization", "bearer " + authToken)//
    });//pass config and edit

    return next.handle(authRequest);//handle Auth
  }

}
