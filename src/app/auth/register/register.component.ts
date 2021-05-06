import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  isLoading: false;
  constructor(private authService: AuthService) {}


  ngOnInit(): void {
  }

  onRegister(registerForm: NgForm) {
    console.log('subbing')
    // if(registerForm.invalid) {
    //   return;
    // }
    // const user = {
    //   email: registerForm.value.email,
    //   password: registerForm.value.password,
    //   login: false
    // }
    this.authService.loginRegister(
      registerForm.value.email,
      registerForm.value.password,
      false);
  }
}
