import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, take } from 'rxjs';
import { Curso } from '../interfaces/curso.interface';
import { enviroment } from 'src/environments/enviroments';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private baseUrl: string = enviroment.baseUrl;

  constructor( private http:HttpClient) { }

  getCursos():Observable<Curso[]>{

    return this.http.get<Curso[]>(`${ this.baseUrl }/cursos`)

  }

  getCursoById(id:number):Observable<Curso>{
    return this.http.get<Curso>(`${ this.baseUrl }/cursos/${id}`)

  }

  agregarCurso( curso: Curso): Observable<Curso>{
    console.log('curso::: ', curso);
    return this.http.post<Curso>(`${ this.baseUrl }/cursos`, curso)
  }

  actualizarCurso( curso: Curso): Observable<Curso>{
    return this.http.put<Curso>(`${ this.baseUrl }/cursos/${ curso.id }`, curso)
  }

  borrarCurso( id: number): Observable<any>{
    return this.http.delete<any>(`${ this.baseUrl }/cursos/${ id }`)
  }
}
