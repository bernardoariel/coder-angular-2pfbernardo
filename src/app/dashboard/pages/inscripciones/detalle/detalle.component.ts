import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ListadoComponent } from '../listado/listado.component';
import { Inscripcion, InscripcionService } from 'src/app/core/services/inscripcion.service';
import { CursoService } from 'src/app/core/services/curso.service';
import { AlumnoService } from 'src/app/core/services/alumno.service';
import { Estudiante } from 'src/app/core/interfaces/estudiante.interface';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent {
  titulo:string = '';
  tipo:string = '';
  foto:string = '';
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

  constructor(
    private dialogRef:MatDialogRef<ListadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { inscripcion?: Inscripcion },
    private cursoService:CursoService,
    private alumnosService:AlumnoService,
    private inscripcionesService:InscripcionService
  ){
    if(data && data.inscripcion){
      console.log('datos en detalle ', data.inscripcion);

      let fotoUrl = '';
      if (data && data.inscripcion && data.inscripcion.idCurso) {
        fotoUrl = `../assets/img/cursos/${data.inscripcion.idCurso}.png`;
      } else {
        fotoUrl = this.fotoDefault;
      }
      this.foto = fotoUrl //tengo la foto
      this.titulo = data.inscripcion.nombre ; //tengo el nombre
      this.idInscripcion = data.inscripcion.id; //tengo el id de la inscripcion o curso a inscribir
      this.foto =(data.inscripcion.id<4)?fotoUrl : this.fotoDefault



      const idCurso = data.inscripcion?.idCurso;

      if (idCurso) {
        this.cursoService.getCursoById(idCurso).subscribe(
          curso => {
            console.log('curso::: ', curso);
            this.idCurso = curso!.id
            this.nombreCurso = curso?.nombre ?? 'No encontrado'

          }
        )
      }
      this.alumnosService.getAlumnos().subscribe(
        alumnos => {
          this.alumnosTodos = alumnos;
          this.alumnosNoInscriptos = alumnos.filter(alumno => !data.inscripcion?.alumnosInscriptos?.find(a => a === alumno.id));
          this.alumnosInscriptos = alumnos.filter(alumno => data.inscripcion?.alumnosInscriptos?.find(a => a === alumno.id));
      })

    }
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

  obtenerAlumnosNoInscriptos(alumnosInscriptos: any[]): void {
    this.alumnosService.getAlumnos().subscribe(
      alumnos => {
        return alumnos.filter(alumno => !alumnosInscriptos.find(a => a.id === alumno.id));
      }
    );
  }

  eliminarCursoAlumno(id: number, alumno: Estudiante) {

      this.inscripcionesService.eliminarInscripcionDelAlumno(id, alumno.id!).subscribe(
        inscripcion => {

          this.alumnosInscriptos = this.alumnosInscriptos.filter(a => a.id !== alumno.id);
          this.alumnosNoInscriptos.push(alumno);
        }
      );
  }

  agregarAlumno(alumno: Estudiante) {

    this.inscripcionesService.agregarInscripcionAlumno(this.idInscripcion, alumno).subscribe(
      inscripcion => {
        console.log('inscripcion::: ', inscripcion);
        this.alumnosInscriptos.push(alumno);
        this.alumnosNoInscriptos = this.alumnosNoInscriptos.filter(a => a.id !== alumno.id);


    })
  }

}
