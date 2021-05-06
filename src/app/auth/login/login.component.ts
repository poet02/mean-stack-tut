import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',//with app routing we dont need a template
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onLogin(loginForm: NgForm) {
    console.log("firring")
    console.log(loginForm.value)
    this.authService.loginRegister(
      loginForm.value.email,
      loginForm.value.password,
      true
    )
  }

}
