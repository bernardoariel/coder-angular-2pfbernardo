import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {  Observable, catchError, map, of } from 'rxjs';
import { AppState } from 'src/app/store';
import { EstablecerUsuarioAutenticado, QuitarUsuarioAutenticado } from 'src/app/store/auth/auth.actions';
import { selectAuthUser } from 'src/app/store/auth/auth.selectors';
import { enviroment } from 'src/environments/enviroments';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  role: string;
  password: string;
  email:string;
  token:string;
  studentId?:number;
}

export interface LoginFormValue {
  email: string;
  password: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = enviroment.baseUrl;
  //private authUser$ = new BehaviorSubject<Usuario | null>(null)

  constructor(
    private http:HttpClient,
    private router:Router,
    private store: Store<AppState>
    ) { }

  obtenerUsuarioAutenticado(): Observable<Usuario | null> {
    // return this.authUser$.asObservable();
    return this.store.select(selectAuthUser)
  }
  establecerUsuarioAutenticado(usuario:Usuario,token:string){
    // this.authUser$.next(usuario)
    this.store.dispatch(EstablecerUsuarioAutenticado({payload:{...usuario,token}}))
  }
  login(formValue: LoginFormValue): Promise<Usuario | null> {
    return new Promise((resolve, reject) => {
      this.http.get<Usuario[]>(`${this.baseUrl}/users`, {
        params: {
          ...formValue
        }
      }).subscribe((usuarios) => {
      const usuarioAutenticado = usuarios[0];
      if (usuarioAutenticado) {
        
        localStorage.setItem('token', usuarioAutenticado.token);
        this.establecerUsuarioAutenticado(usuarioAutenticado, usuarioAutenticado.token);
        if (usuarioAutenticado.role === 'admin') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/landing']);
        }
        resolve(usuarioAutenticado);
      } else {
        resolve(null);
      }
    }, (error) => {
      reject(error);
    });
  });
}





  verificarToken(): Observable<boolean>{
    const token = localStorage.getItem('token')
    return this.http.get<Usuario[]>(`${this.baseUrl}/users?token=${token}`,
    {
      headers: new HttpHeaders({
        'Authorizations': token || ''
      })
    })
      .pipe(
        map((usuarios)=>{
          const usuarioAutenticado = usuarios[0]
          if(usuarioAutenticado){
            localStorage.setItem('token',usuarioAutenticado.token)
            // this.authUser$.next(usuarioAutenticado)
            this.establecerUsuarioAutenticado(usuarioAutenticado,usuarioAutenticado.token)

          }
          return !!usuarioAutenticado
        }),
        catchError((err)=>{
          
          // return throwError(()=>err)
          return of(false)
        })
      )

  }
  logout(){
    localStorage.removeItem('token')
    // this.authUser$.next(null)
    this.store.dispatch(QuitarUsuarioAutenticado())
    this.router.navigate(['landing'])
  }
}
