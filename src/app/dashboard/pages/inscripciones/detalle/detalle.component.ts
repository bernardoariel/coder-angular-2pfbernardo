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
            this.idCurso = curso!.id
            this.nombreCurso = curso?.nombre ?? 'No encontrado'
          }
        )
      }

      // Obtener los detalles de los alumnos inscritos en el curso
      this.alumnosService.getAlumnos().subscribe(
        alumnos => {
          const alumnosInscriptos =  this.alumnos = data.inscripcion!.alumnosInscriptos?.map(
            (alumnoId: number): Estudiante => {
              const alumno: Estudiante | undefined = alumnos.find(alumno => alumno.id === alumnoId);
              return alumno!;
            }
          ) || [];
          this.alumnosNoInscriptos = alumnos.filter(
            alumno => !alumnosInscriptos.includes(alumno)
          );
        }
      );

    } else {
      this.alumnos = [];
    }
  }
  eliminarCursoAlumno(id: number, idAlumno?: number, i?: number) {

    this.inscripcionesService.eliminarInscripcionDelAlumno(id, idAlumno!);

    const inscripcion = this.data.inscripcion;
    if (inscripcion) {

      const indice = inscripcion.alumnosInscriptos?.findIndex(alumnoId => alumnoId === idAlumno);

      if (indice !== undefined && indice >= 0) {

        inscripcion.alumnosInscriptos?.splice(indice, 1);
        // Actualizar la lista de alumnos inscriptos
        this.alumnos = inscripcion.alumnosInscriptos?.map(
          (alumnoId: number): Estudiante => {
            const alumno: Estudiante | undefined = this.alumnosTodos?.find(alumno => alumno.id === alumnoId);
            return alumno!;
          }
        ) || [];


      }
    }

    // Eliminar fila de la vista
    if (i !== undefined && i >= 0) {
      const alumnoEliminado = this.alumnos.find(alumno => alumno.id === idAlumno);
      if (alumnoEliminado) {
        console.log('alumnoEliminado::: ', alumnoEliminado);
        this.alumnosNoInscriptos.push(alumnoEliminado);
      }
      this.alumnos.splice(i, 1);
    }
  }

  agregarAlumno(alumno: Estudiante) {
    this.inscripcionesService.inscripciones$.subscribe(inscripciones => {
      const inscripcion = inscripciones.find(inscripcion => inscripcion.id === this.idInscripcion);
      if (inscripcion && alumno) {
        inscripcion.alumnosInscriptos?.push(alumno.id || 0);
        // this.inscripcionesService.editarInscripcion(inscripcion);
        this.alumnos.push(alumno);
        this.alumnosNoInscriptos = this.alumnosNoInscriptos.filter(a => a.id !== alumno.id);
      }
    });
  }

}
