import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from 'src/environments/enviroments';
import { AlumnoService } from './alumno.service';

export interface Usuario{
  id:number;
  idEstudiante:number;
  password:string;
  email:string;
  role:string;
  token:string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl: string = enviroment.baseUrl;
  constructor( private http:HttpClient ) { }

  getUsuarios():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${ this.baseUrl }/usuarios`)
  }
  getUsuarioById(id:number):Observable<Usuario>{
    return this.http.get<Usuario>(`${ this.baseUrl }/usuarios/${id}`)
  }

  getUsuarioByIdestudiante(id:number):Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${ this.baseUrl }/usuarios/?idEstudiante=${id}`)
  }
  guardarEmailYPasswordEnTablaSeparada(idEstudiante: number, email: string, password: string,role:string): Observable<any> {
    const token = this.generateRandomToken(16);
    return this.http.post(`${ this.baseUrl }/usuarios`, { idEstudiante, email,  password,role,token});
  }
  generateRandomToken(length:number) {
    let token = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      const randomCharacter = characters.charAt(randomIndex);
      token += randomCharacter;
    }

    return token;
  }

  agregarUsuario( usuario: Usuario): Observable<Usuario>{
    const userNew ={
      ...usuario,
      token:this.generateRandomToken(16)

    }
    return this.http.post<Usuario>(`${ this.baseUrl }/usuarios`, userNew)
  }
  borrarUsuario( id: number): Observable<any>{


    return this.http.delete<any>(`${ this.baseUrl }/usuarios/${ id }`)
  }
  actualizarUsuario( usuario: Usuario): Observable<Usuario>{
    console.log('usuario::: ', usuario);
    return this.http.put<Usuario>(`${ this.baseUrl }/usuarios/${ usuario.id }`, usuario)
  }
  actualizarPropiedades(idEstudiante:number, email:string, role:string){

    return this.http.patch<Usuario>(`${ this.baseUrl }/usuarios/${ idEstudiante }`, {email:email, role:role})
  }
}
