import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, map, mergeMap, of, switchMap, take } from 'rxjs';
import { enviroment } from 'src/environments/enviroments';
import { Estudiante } from '../interfaces/estudiante.interface';


export interface Inscripcion {

  formatoCurso: string;
  id: number;
  idCurso: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  alumnosInscriptos?: number[];
  detalleCurso?: string | null;
  nombreCurso?: string | null;
  tipoCurso?: string | null;
  nivelCurso?: string | null;
}


@Injectable({
  providedIn: 'root'
})
export class InscripcionService {


  private baseUrl: string = enviroment.baseUrl;
  constructor( private http:HttpClient) { }

  getInscripciones(): Observable<Inscripcion[]> {

    return this.http.get<Inscripcion[]>(`${ this.baseUrl }/inscripciones`)

  }
  getInscripcionById(id:number):Observable<Inscripcion>{
    return this.http.get<Inscripcion>(`${ this.baseUrl }/inscripciones/${id}`)
  }

  agregarIscripcion( payload: Inscripcion): Observable<Inscripcion>{
    return this.http.post<Inscripcion>(`${ this.baseUrl }/inscripciones`, payload)
  }

  borrarInscripcion( id: number): Observable<any>{
    return this.http.delete<any>(`${ this.baseUrl }/inscripciones/${ id }`)
  }

  actualizarInscripcion( inscripcion: Inscripcion): Observable<Inscripcion>{
    return this.http.put<Inscripcion>(`${ this.baseUrl }/inscripciones/${ inscripcion.id }`, inscripcion)
  }

  getCursosDelAlumno(alumnoId: number): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(`${this.baseUrl}/inscripciones`).pipe(
      map(inscripciones => inscripciones.filter(inscripcion => inscripcion.alumnosInscriptos?.includes(alumnoId)))
    );
  }

  eliminarInscripcionDelAlumno(inscripcionId: number, alumnoId: number) {
    // Obtener la inscripción actual del servidor
    return this.http.get<Inscripcion>(`${this.baseUrl}/inscripciones/${inscripcionId}`).pipe(
      switchMap(inscripcion => {
        if(inscripcion.alumnosInscriptos){

          inscripcion.alumnosInscriptos = inscripcion.alumnosInscriptos.filter(id => id !== alumnoId);
          // Enviar una solicitud PUT al servidor con la inscripción actualizada
          return this.http.put<Inscripcion>(`${this.baseUrl}/inscripciones/${inscripcionId}`, inscripcion);
        }else{
          return EMPTY;
        }
      })
    );
  }

  agregarInscripcionAlumno(inscripcionId: number, alumno: Estudiante): Observable<Inscripcion> {
    console.log('alumno::: ', alumno);
    console.log('inscripcionId::: ', inscripcionId);
    // Obtener la inscripción por idCurso
    return this.http.get<Inscripcion>(`${this.baseUrl}/inscripciones/${inscripcionId}`).pipe(
      mergeMap(inscripcion => {
        // Agregar el alumno al array de alumnosInscriptos
        if (!inscripcion.alumnosInscriptos) {
          inscripcion.alumnosInscriptos = []; // si no hay alumnos inscriptos, crear un array vacío
        }
        inscripcion.alumnosInscriptos.push(alumno.id!);
        // Actualizar la inscripción
        return this.actualizarInscripcion(inscripcion);
      })
    );
  }
  eliminarSubscripciones(idEstudiante:number){
    this.http.get<Inscripcion[]>(`${ this.baseUrl }/inscripciones`)
    .subscribe((inscripciones: any[]) => {
      const numeroEliminar = idEstudiante; // Número a eliminar del array

      const inscripcionesActualizadas = inscripciones.map(inscripcion => {
        const alumnosInscriptosActualizados = inscripcion.alumnosInscriptos.filter((alumno: number) => alumno !== numeroEliminar);
        return { ...inscripcion, alumnosInscriptos: alumnosInscriptosActualizados };
      });

      console.log('inscripcionesActualizadas::: ', inscripcionesActualizadas);
      // Luego puedes hacer la llamada al endpoint correspondiente para actualizar los registros en la base de datos

     /*  this.http.put('url_de_la_api/inscripciones', inscripcionesActualizadas).subscribe(response => {
        console.log('Registros actualizados:', response);
      }); */
    });
  }


}
