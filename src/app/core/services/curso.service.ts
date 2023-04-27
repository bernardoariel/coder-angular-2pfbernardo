import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, take } from 'rxjs';
import { Curso } from '../interfaces/curso.interface';



const cursos: Curso[] = [
  { id: 1, nombre: 'JavaScript',tipo: 'basico'},
  { id: 2, nombre: 'Python',tipo: 'intermedio'},
  { id: 3, nombre: 'Java', tipo: 'avanzado'},
  { id: 4, nombre: 'C++',tipo:'avanzado'},
  { id: 5, nombre: 'Ruby', tipo: 'basico'},
  { id: 6, nombre: 'Swift',tipo:  'basico'},
  { id: 7, nombre: 'Go', tipo: 'basico'},
  { id: 8, nombre: 'PHP', tipo: 'intermedio'},
  { id: 9, nombre: 'TypeScript',tipo: 'avanzado'},
  { id: 10, nombre: 'Rust', tipo: 'basico'}
];

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  private cursos$ = new BehaviorSubject<Curso[]>([])
  constructor() { }

  getCursos(): Observable<Curso[]> {

    this.cursos$.next(cursos);
    return this.cursos$.asObservable();

  }

  getCursoById(cursoId: number): Observable<Curso | undefined> {
    return of(cursos.find((curso) => curso.id === cursoId));
  }
  crearCurso(payload: Curso): Observable<Curso[]> {
    console.log('payload::: ', payload);

    this.cursos$
      .pipe(
        take(1)
      ).subscribe({
        next: (cursos) => {
          this.cursos$.next([
            ...cursos,
            {
              ...payload
            }

          ])
        },
        complete: () => {},
        error: () => {}
      });

    return this.cursos$.asObservable();
  }
  editarCurso(cursoId: number, actualizacion: Partial<Curso>): Observable<Curso[]> {
    this.cursos$.pipe(
      take(1),
      map(cursos => cursos.map(curso => curso.id === cursoId ? { ...curso, ...actualizacion } : curso))
    ).subscribe(cursosActualizados => this.cursos$.next(cursosActualizados));

    return this.cursos$.asObservable();
  }
  eliminarCurso(payload:Curso): Observable<Curso[]> {
    this.cursos$
      .pipe(
        take(1),
        map((cursos) => cursos.filter((curso) => curso.id !== payload.id))
      )
      .subscribe({
        next: (cursos) => this.cursos$.next(cursos),
        complete: () => {},
        error: () => {}
      });

    return this.cursos$.asObservable();
  }
}
