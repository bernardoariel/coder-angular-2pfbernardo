import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ListadoComponent } from '../listado/listado.component';
import { Inscripcion } from 'src/app/core/services/inscripcion.service';
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
  nombreCurso:string = '';
  alumnos: Estudiante[] = [];

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  constructor(
    private dialogRef:MatDialogRef<ListadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { inscripcion?: Inscripcion },
    private cursoService:CursoService,
    private alumnosService:AlumnoService
  ){
    if(data && data.inscripcion){
      console.log('data.inscripcion::: ', data.inscripcion);

      let fotoUrl = `../assets/img/cursos/${data.inscripcion.idCurso}.png`

      this.foto = fotoUrl
      this.titulo = data.inscripcion.nombre ;
      // this.tipo = data.curso.tipo
      this.foto =(data.inscripcion.id<4)?fotoUrl : this.fotoDefault
      console.log('data.inscripcion.idCurso::: ', data.inscripcion.idCurso);
      this.cursoService.getCursoById(data.inscripcion.idCurso).subscribe(
        curso => {
          this.nombreCurso = curso?.nombre || 'No encontrado'

        }
      )
      // Obtener los detalles de los alumnos inscritos en el curso
      this.alumnosService.getAlumnos().subscribe(
        alumnos => {
          this.alumnos = data.inscripcion!.alumnosInscriptos?.map(
            (alumnoId: number): Estudiante => {
              const alumno: Estudiante | undefined = alumnos.find(alumno => alumno.id === alumnoId);
              console.log('alumno::: ', alumno);

              return alumno!;
            }
          ) || [];
        }
      );

    } else {
      this.alumnos = [];
    }
  }
}
