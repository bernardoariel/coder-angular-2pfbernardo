import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from 'src/environments/enviroments';


export interface Usuario{
  id:number;
  studentId:number;
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
    return this.http.get<Usuario[]>(`${ this.baseUrl }/users`)
  }
  getUsuarioById(id:number):Observable<Usuario>{
    return this.http.get<Usuario>(`${ this.baseUrl }/users/${id}`)
  }
  getUsuarioByCampoValor(campo: string, valor: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/users?${campo}=${valor}`);
  }
  getUsuarioByStudentId(id:number):Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${ this.baseUrl }/users/?studentId=${id}`)
  }
  guardarEmailYPasswordEnTablaSeparada(studentId: number, email: string, password: string,role:string): Observable<any> {
    const token = this.generateRandomToken(16);
    return this.http.post(`${ this.baseUrl }/users`, { studentId, email,  password,role,token});
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
    return this.http.post<Usuario>(`${ this.baseUrl }/users`, userNew)
  }
  borrarUsuario( id: number): Observable<any>{


    return this.http.delete<any>(`${ this.baseUrl }/users/${ id }`)
  }
  actualizarUsuario( usuario: Usuario): Observable<Usuario>{

    return this.http.put<Usuario>(`${ this.baseUrl }/users/${ usuario.id }`, usuario)
  }
  actualizarPropiedades(studentId:number, email:string, role:string){

    return this.http.patch<Usuario>(`${ this.baseUrl }/users/${ studentId }`, {email:email, role:role})
  }
}
