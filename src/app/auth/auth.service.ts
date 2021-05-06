import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthData } from './register/auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
   private token: string;

   //create listener use subject, this way components can be notified
   private authStatusListener =   new Subject();


  constructor(private http: HttpClient, private router: Router) {}
  getToken() {
    return this.token;
  }

  loginRegister(email: string, password: string, login: boolean) {
    console.log('here')
    let url = "http://localhost:3000/api/users/";
    if (login) {
      url += "login"
    } else {
      url += "register"
    }
    const authData: AuthData = {
      email: email,
      password: password
    }
    this.http
      .post<{token}>(
        url,
        authData
      )
      .subscribe((response) => {
        console.log(response)
        const token = response.token;
        this.token = token;
      });
  }
}
