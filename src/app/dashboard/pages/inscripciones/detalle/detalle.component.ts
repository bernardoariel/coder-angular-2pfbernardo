import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ListadoComponent } from '../listado/listado.component';
import { Inscripcion, InscripcionService } from 'src/app/core/services/inscripcion.service';
import { CursoService } from 'src/app/core/services/curso.service';
import { AlumnoService } from 'src/app/core/services/alumno.service';
import { Estudiante } from 'src/app/core/interfaces/estudiante.interface';
import { AuthService, Usuario } from 'src/app/core/services/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent {
  titulo:string = '';
  tipo:string = '';
  foto:string = './assets/foto.js';
  fotoDefault:string = '../assets/img/cursos/default.png'
  idCurso:number = 0;
  idInscripcion: number = 0;
  nombreCurso:string = '';
  alumnos: Estudiante[] = [];
  alumnosNoInscriptos: Estudiante[] = [];
  alumnosTodos: Estudiante[] | undefined;
  alumnosInscriptos: Estudiante[] = []
  fechaFin!:Date
  esFechaFinAnteriorAHoy: boolean = false;
  authUserRole!:Usuario | null;
  estoyInscripto:boolean = false
  nrosAlumnoInscripto?:number[] = []
  constructor(
    private dialogRef:MatDialogRef<ListadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { inscripcion?: Inscripcion },
    private cursoService:CursoService,
    private alumnosService:AlumnoService,
    private inscripcionesService:InscripcionService,
    private authService: AuthService
  ){
    if(data && data.inscripcion){
      console.log('datos en detalle ', data.inscripcion);

      this.titulo = data.inscripcion.nombre ; //tengo el nombre
      this.idInscripcion = data.inscripcion.id; //tengo el id de la inscripcion o curso a inscribir
      this.foto = '../assets/img/cursos/default.png'
      const fechaFin = new Date(data.inscripcion?.fecha_fin!);
      const hoy = new Date();
      this.esFechaFinAnteriorAHoy = fechaFin < hoy;
      this.nrosAlumnoInscripto = data.inscripcion.alumnosInscriptos
      const idCurso = data.inscripcion?.idCurso;

      if (idCurso) {
        console.log('idCurso::: ', idCurso);
        this.cursoService.getCursoById(idCurso).subscribe(
          curso => {
            console.log('curso::: ', curso);
            this.idCurso = curso!.id
            this.nombreCurso = curso?.nombre ?? 'No encontrado'
            this.foto = curso?.foto!

          }
        )
      }
      this.alumnosService.getAlumnos().subscribe(
        alumnos => {
          this.alumnosTodos = alumnos;
          this.alumnosNoInscriptos = alumnos.filter(alumno => {
      // Agrega una condición adicional para filtrar por un campo distinto de 'user'
      return alumno.nombre !== 'user' && !data.inscripcion?.alumnosInscriptos?.find(a => a === alumno.id);
    });
    this.alumnosInscriptos = alumnos.filter(alumno => {
      // Agrega una condición adicional para filtrar por un campo distinto de 'user'
      return alumno.nombre !== 'user' && data.inscripcion?.alumnosInscriptos?.find(a => a === alumno.id);
    });
      })

    }
    this.authService.obtenerUsuarioAutenticado().pipe(take(1)).subscribe(
      (usuario: Usuario | null) => {
        console.log('Usuario::: ', usuario);
        this.authUserRole = usuario;
        if(this.nrosAlumnoInscripto && this.authUserRole && this.nrosAlumnoInscripto.includes(this.authUserRole.idEstudiante!)){
          this.estoyInscripto = true
        }

      }
    );
  }
  obtenerAlumnosInscriptos(alumnosInscriptos: number[]): void {
    console.log('alumnosInscriptos::: ', alumnosInscriptos);
    const alumnos: any[] = [];
    for (const id of alumnosInscriptos) {
      this.alumnosService.getEstudiantePorId(id)
        .subscribe(estudiante => {
          console.log('estudiante::: ', estudiante);
          // Agrega el objeto alumno a la lista
          alumnos.push({id: estudiante.id, nombre: estudiante.nombre, apellido: estudiante.apellido});
        });
    }
    this.alumnosInscriptos = alumnos;
  }

  /* obtenerAlumnosNoInscriptos(alumnosInscriptos: any[]): void {
    this.alumnosService.getAlumnos().subscribe(
      alumnos => {
        return alumnos.filter(alumno => !alumnosInscriptos.find(a => a.id === alumno.id));
      }
    );
  } */

  eliminarCursoAlumno(id: number, alumno: Estudiante) {

      this.inscripcionesService.eliminarInscripcionDelAlumno(id, alumno.id!).subscribe(
        inscripcion => {

          this.alumnosInscriptos = this.alumnosInscriptos.filter(a => a.id !== alumno.id);
          this.alumnosNoInscriptos.push(alumno);
          this.estoyInscripto = false
        }
      );
  }

  agregarAlumno(alumno: Estudiante) {

    this.inscripcionesService.agregarInscripcionAlumno(this.idInscripcion, alumno).subscribe(
      inscripcion => {
        console.log('inscripcion::: ', inscripcion);
        this.alumnosInscriptos.push(alumno);
        this.alumnosNoInscriptos = this.alumnosNoInscriptos.filter(a => a.id !== alumno.id) ;


    })
  }
  agregarEstudiante(usuario: Usuario) {
    this.alumnosService.getEstudiantePorId(usuario.id).subscribe(estudiante => {
      console.log(estudiante);
      // Aquí puedes llamar a la función agregarInscripcionAlumno y pasar el estudiante como argumento
      this.inscripcionesService.agregarInscripcionAlumno(this.idInscripcion, estudiante).subscribe(
        inscripcion => {
          console.log('inscripcion::: ', inscripcion);
          this.alumnosInscriptos.push(estudiante);
          this.alumnosNoInscriptos = this.alumnosNoInscriptos.filter(a => a.id !== estudiante.id);
        }
      );
    });
  }
  //TODO desuscribirme de un curso

}
