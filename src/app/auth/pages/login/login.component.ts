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
  isLoadding = false
  emailControl = new FormControl('', [Validators.required]);
  passwordControl = new FormControl('', [Validators.required]);
  loginForm = new FormGroup({
    email: this.emailControl,
    password: this.passwordControl,
  });
errorAutenticacion:boolean=false;
  constructor(
     private authService: AuthService,
    private activatedRoute: ActivatedRoute) {

  }


  onSubmit(): void {

    this.isLoadding = true

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();
     
    } else {

      let respuestaLogin = this.authService.login(this.loginForm.value as LoginFormValue);
      respuestaLogin.then((usuarioAutenticado) => {
        this.isLoadding = false;
        if(!usuarioAutenticado){
          //aca va el mensaje
           this.errorAutenticacion = true;
        }
      }).catch((error) => {
        console.error('Error al iniciar sesión:', error);
      });
    }

  }
}
