import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, switchMap, take } from 'rxjs';
import { Estudiante } from '../interfaces/estudiante.interface';


const alumnos: Estudiante[] = [
  {
    id: 1,
    nombre: 'Federico',
    apellido: 'González',
    fechaNacimiento: '2001-01-15',
    matricula: '001',
    fotoPerfilUrl: `https://randomuser.me/api/portraits/med/men/1.jpg`,
    fotoUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    idCurso:1
  },
  {
    id: 2,
    nombre: 'Tomás',
    apellido: 'López',
    fechaNacimiento: '2002-03-20',
    matricula: '002',
    fotoPerfilUrl: 'https://randomuser.me/api/portraits/med/men/2.jpg',
    fotoUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
    idCurso:3
  },
  {
    id: 3,
    nombre: 'Juan',
    apellido: 'MarTínez',
    fechaNacimiento: '2000-05-08',
    matricula: '003',
    fotoPerfilUrl: 'https://randomuser.me/api/portraits/med/men/3.jpg',
    fotoUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
    idCurso:2
  },
  {
    id:4,
    nombre: 'Pedro',
    apellido: 'García',
    fechaNacimiento: '1999-07-12',
    matricula: '004',
    fotoPerfilUrl: 'https://randomuser.me/api/portraits/med/men/4.jpg',
    fotoUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
    idCurso:4
  },
  {
    id:5,
    nombre: 'Hernan',
    apellido: 'Hernández',
    fechaNacimiento: '2002-10-22',
    matricula: '005',
    fotoPerfilUrl: 'https://randomuser.me/api/portraits/med/men/5.jpg',
    fotoUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
    idCurso:4
  },

  {
    id:6,
    nombre: 'Luis',
    apellido: 'Ramírez',
    fechaNacimiento: '2001-12-05',
    matricula: '006',
    fotoPerfilUrl: 'https://randomuser.me/api/portraits/med/men/6.jpg',
    fotoUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
    idCurso:2
  },
];

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  private alumnos$ = new BehaviorSubject<Estudiante[]>([])
  constructor() { }

  getAlumnos(): Observable<Estudiante[]> {

    this.alumnos$.next(alumnos)
    return this.alumnos$.asObservable()
  }
  getAlumnoById(alumnoId: number): Observable<Estudiante | undefined> {
    return of(alumnos.find((alumno) => alumno.id === alumnoId));
  }
  crearAlumno(payload:Estudiante): Observable<Estudiante[]> {
    const totalAlumnos = this.alumnos$.getValue().length + 1;
    const matricula = totalAlumnos.toString().padStart(3, '0');
    this.alumnos$
      .pipe(
        take(1)
      )
      .subscribe({
        next: (alumnos) => {
          this.alumnos$.next([
            ...alumnos,
            {
              id: alumnos.length + 1,
              ...payload,
              matricula,
              fotoPerfilUrl:`https://randomuser.me/api/portraits/med/men/${totalAlumnos}.jpg`,
              fotoUrl: `https://randomuser.me/api/portraits/men/${totalAlumnos}.jpg`,
            },
          ]);
        },
        complete: () => {},
        error: () => {}
      });

      // then => next
      // catch => error
      // finally => complete

    return this.alumnos$.asObservable();
  }

  eliminarAlumno(payload:Estudiante): Observable<Estudiante[]> {
    this.alumnos$
      .pipe(
        take(1),
        map((alumnos) => alumnos.filter((alumno) => alumno.id !== payload.id))
      )
      .subscribe({
        next: (alumnos) => this.alumnos$.next(alumnos),
        complete: () => {},
        error: () => {}
      });

    return this.alumnos$.asObservable();
  }
  editarAlumno(alumnoId: number, actualizacion: Partial<Estudiante>): Observable<Estudiante[]> {
    this.alumnos$.pipe(
      take(1),
      map(alumnos => alumnos.map(alumno => alumno.id === alumnoId ? { ...alumno, ...actualizacion } : alumno))
    ).subscribe(alumnosActualizados => this.alumnos$.next(alumnosActualizados));

    return this.alumnos$.asObservable();
  }
 
}
