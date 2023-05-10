import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of, throwError } from 'rxjs';
import { enviroment } from 'src/environments/enviroments';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  role: string;
  password: string;
  email:string;
  token:string;
  idEstudiante?:number;
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
  private authUser$ = new BehaviorSubject<Usuario | null>(null)

  constructor(
    private http:HttpClient,
    private router:Router
    ) { }

  obtenerUsuarioAutenticado(): Observable<Usuario | null> {
    return this.authUser$.asObservable();
  }

  login(formValue:LoginFormValue):void{
   /*  const usuario:Usuario ={
      id:1,
      nombre:'Juan',
      apellido:'Perez',
      email:formValue.email,
      password:formValue.password,
      role:'user'
    }
    localStorage.setItem('usuario',JSON.stringify(usuario))
    this.authUser$.next(usuario)
    this.router.navigate(['/dashboard']) */
    this.http.get<Usuario[]>(`${this.baseUrl}/usuarios`,
    {
      params:{
        ...formValue
      }
    }).subscribe(
      {
        next:(usuarios)=>{
          const usuarioAutenticado = usuarios[0]
          if(usuarioAutenticado){
            console.log('usuarioAutenticado::: ', usuarioAutenticado);
            localStorage.setItem('token',usuarioAutenticado.token)
            this.authUser$.next(usuarioAutenticado)
            if(usuarioAutenticado.role === 'admin'){
              this.router.navigate(['/dashboard'])}
              else{
                this.router.navigate(['/landing'])
              }
            // this.router.navigate(['/dashboard'])
          }else{
            alert('usuario y contraseña incorrecta')
          }
        }
      }
    )
  }

  verificarToken(): Observable<boolean>{
    const token = localStorage.getItem('token')
    return this.http.get<Usuario[]>(`${this.baseUrl}/usuarios?token=${token}`,
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
            this.authUser$.next(usuarioAutenticado)

          }
          return !!usuarioAutenticado
        }),
        catchError((err)=>{
          console.log('Error al verifivar el token');
          // return throwError(()=>err)
          return of(false)
        })
      )

  }
  logout(){
    localStorage.removeItem('token')
    this.authUser$.next(null)
    this.router.navigate(['landing'])
  }
}
