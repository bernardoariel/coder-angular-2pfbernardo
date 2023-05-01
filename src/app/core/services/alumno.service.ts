import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, of, switchMap, take, tap } from 'rxjs';
import { Estudiante } from '../interfaces/estudiante.interface';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'src/environments/enviroments';


@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  private baseUrl: string = enviroment.baseUrl;
  constructor( private http:HttpClient) { }

  getAlumnos():Observable<Estudiante[]>{

    return this.http.get<Estudiante[]>(`${ this.baseUrl }/alumnos`)

  }

  getUltimoAlumno(): Observable<Estudiante> {
    return this.http.get<Estudiante[]>(`${this.baseUrl}/alumnos`).pipe(
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
    return this.http.get<Estudiante>(`${ this.baseUrl }/alumnos/${id}`)

  }

  agregarAlumno( alumno: Estudiante): Observable<Estudiante>{
    return this.http.post<Estudiante>(`${ this.baseUrl }/alumnos`, alumno)
  }

  actualizarAlumno( alumno: Estudiante): Observable<Estudiante>{
    return this.http.put<Estudiante>(`${ this.baseUrl }/alumnos/${ alumno.id }`, alumno)
  }

  borrarAlumno( id: number): Observable<any>{
    return this.http.delete<any>(`${ this.baseUrl }/alumnos/${ id }`)
  }

}
