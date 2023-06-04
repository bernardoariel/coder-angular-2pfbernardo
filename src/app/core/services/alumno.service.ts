import { Injectable } from '@angular/core';
import {  Observable,  map,  switchMap } from 'rxjs';
import { Estudiante } from '../interfaces/estudiante.interface';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'src/environments/enviroments';
import { Usuario, UsuarioService } from './usuario.service';


@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  private baseUrl: string = enviroment.baseUrl;
  constructor( private http:HttpClient, private usuariosService:UsuarioService) { }

  getAlumnos():Observable<Estudiante[]>{

    return this.http.get<Estudiante[]>(`${ this.baseUrl }/students`)

  }

  getUltimoAlumno(): Observable<Estudiante> {
    return this.http.get<Estudiante[]>(`${this.baseUrl}/students`).pipe(
      map((alumnos) => {
        const ultimoAlumno = alumnos.pop();
        if (!ultimoAlumno) {
          throw new Error('No se pudo encontrar el último alumno');
        }
        return ultimoAlumno;
      })
    );
  }
  getEstudiantePorId(id:number):Observable<Estudiante>{
    return this.http.get<Estudiante>(`${ this.baseUrl }/students/${id}`)

  }

/*   agregarAlumno( alumno: Estudiante): Observable<Estudiante>{
    return this.http.post<Estudiante>(`${ this.baseUrl }/alumnos`, alumno)
  } */

  actualizarAlumno( alumno: Estudiante): Observable<Estudiante>{
    return this.http.put<Estudiante>(`${ this.baseUrl }/students/${ alumno.id }`, alumno)
  }
  agregarAlumno(alumno: Estudiante): Observable<Estudiante> {
    const { email, password, ...alumnoWithoutEmail } = alumno;
    return this.http.post<Estudiante>(`${this.baseUrl}/students`, alumnoWithoutEmail).pipe(
      switchMap((estudianteCreado: Estudiante) => {
        const passwordToSend = alumno.password || alumno.dni;
        return this.usuariosService.guardarEmailYPasswordEnTablaSeparada(
          estudianteCreado.id!,
          email,
          passwordToSend,
          alumno.role,
          ).pipe(
          map(() => estudianteCreado)
        );
      })
    );
  }

  borrarAlumno( id: number): Observable<any>{

    return this.http.delete<any>(`${ this.baseUrl }/students/${ id }`)
  }
  actualizarPropiedades(id:number, email:string, role:string){

    return this.http.patch<Usuario>(`${ this.baseUrl }/students/${ id }`, {email:email, role:role})
  }

}
