import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService, LoginFormValue } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  emailControl = new FormControl('', [Validators.required]);
  passwordControl = new FormControl('', [Validators.required]);
  loginForm = new FormGroup({
    email: this.emailControl,
    password: this.passwordControl,
  });

  constructor(
     private authService: AuthService,
    private activatedRoute: ActivatedRoute) {
    console.log(this.activatedRoute.snapshot);
  }


  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

    } else {
      console.log(this.loginForm.value)
      this.authService.login(this.loginForm.value as LoginFormValue)
    }
  }
}
