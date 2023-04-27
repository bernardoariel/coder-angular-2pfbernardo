import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, take } from 'rxjs';


export interface Inscripcion {
  id: number;
  idCurso: number;
  nombre: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  alumnosInscriptos?: number[];
}

const inscripciones: Inscripcion[] = [
  {
    id: 1,
    idCurso: 3,
    nombre: 'Curso Nuevo de Java',
    fecha_fin: new Date(),
    fecha_inicio: new Date(),
    alumnosInscriptos:[1,3]
  },
  {
    id: 2,
    idCurso: 2,
    nombre: 'Curso Nuevo de Python',
    fecha_fin: new Date(),
    fecha_inicio: new Date(),
    alumnosInscriptos:[2,4]
  },{
    id: 3,
    idCurso: 1,
    nombre: 'Curso Nuevo de JavaScript',
    fecha_fin: new Date(),
    fecha_inicio: new Date(),
    alumnosInscriptos:[1,2,3,4]
  }

];

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {

  private inscripciones$ = new BehaviorSubject<Inscripcion[]>([])
  constructor() { }

  getCursosNuevos(): Observable<Inscripcion[]> {

    this.inscripciones$.next(inscripciones);
    return this.inscripciones$.asObservable();

  }
  crearIscripcion(payload: Inscripcion): Observable<Inscripcion[]> {
    console.log('payload::: ', payload);

    this.inscripciones$
      .pipe(
        take(1)
      ).subscribe({
        next: (inscripciones) => {
          this.inscripciones$.next([
            ...inscripciones,
            {
              ...payload
            }

          ])
        },
        complete: () => {},
        error: () => {}
      });

    return this.inscripciones$.asObservable();
  }
  eliminarInscripcion(payload:Inscripcion): Observable<Inscripcion[]> {
    this.inscripciones$
      .pipe(
        take(1),
        map((inscripciones) => inscripciones.filter((inscripcion) => inscripcion.id !== payload.id))
      )
      .subscribe({
        next: (cursos) => this.inscripciones$.next(cursos),
        complete: () => {},
        error: () => {}
      });

    return this.inscripciones$.asObservable();
  }

  editarInscripcion(inscripcionId: number, actualizacion: Partial<Inscripcion>): Observable<Inscripcion[]> {
    console.log('actualizacion::: ', actualizacion);
    this.inscripciones$.pipe(
      take(1),
      map(inscripciones => inscripciones.map(inscripcion => inscripcion.id === inscripcionId ? { ...inscripcion, ...actualizacion } : inscripcion))
    ).subscribe(cursosActualizados => this.inscripciones$.next(cursosActualizados));

    return this.inscripciones$.asObservable();
  }

}
