import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Usuario {
  email: string;
  password: string;
}

export interface LoginFormValue {
  email: string;
  password: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUser$ = new BehaviorSubject<Usuario | null>(null)

  constructor(private router:Router) { }

  obtenerUsuarioAutenticado(): Observable<Usuario | null> {
    return this.authUser$.asObservable();
  }

  login(formValue:LoginFormValue):void{
    const usuario ={
      id:1,
      nombre:'Juan',
      apellido:'Perez',
      email:formValue.email,
      password:formValue.password
    }
    localStorage.setItem('usuario',JSON.stringify(usuario))
    this.authUser$.next(usuario)
    this.router.navigate(['/dashboard'])
  }

  verificarStorage(){
    const storageValor = localStorage.getItem('usuario')
    if(storageValor){
      const usuario:Usuario = JSON.parse(storageValor)
      this.authUser$.next(usuario)
    }
  }
  logout(){
    localStorage.removeItem('usuario')
    this.authUser$.next(null)
this.router.navigate(['auth','login'])
  }
}
