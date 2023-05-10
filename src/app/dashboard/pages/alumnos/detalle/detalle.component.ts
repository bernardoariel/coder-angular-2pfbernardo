import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ListadoComponent } from '../listado/listado.component';
import { Estudiante } from 'src/app/core/interfaces/estudiante.interface';
import { InscripcionService } from 'src/app/core/services/inscripcion.service';
import { AuthService, Usuario } from 'src/app/core/services/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent {
  titulo:string = 'Detalle de alumno';
  subtitulo:string = '';
  avatar:string = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200';
  foto:string = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200';
  fechaNacimiento: any
  cursosDelAlumno: any;
  alumnoId!: number
  authUserRole:Usuario | null = null;
  constructor(
    private dialogRef:MatDialogRef<ListadoComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: { alumno?: Estudiante },
    private inscripcionesService: InscripcionService
  ){
    if(data && data.alumno){
      console.log('data.alumno::: ', data.alumno);
      this.titulo = data.alumno.nombre + ' ' + data.alumno.apellido;
      this.avatar = data.alumno.fotoPerfilUrl
      this.foto = data.alumno.fotoPerfilUrl
      this.alumnoId = data.alumno.id!
      this.fechaNacimiento= data.alumno.fechaNacimiento
       this.inscripcionesService.getCursosDelAlumno(data.alumno.id!).subscribe((cursos:any)=>{
        this.cursosDelAlumno = cursos
        console.log('this.cursosDelAlumno ::: ', this.cursosDelAlumno );
      })
      this.authService.obtenerUsuarioAutenticado().pipe(take(1)).subscribe(
        (usuario: Usuario | null) => {
          console.log('Usuario::: ', usuario);
          this.authUserRole = usuario;

         
        }
      );
    }
  }
  eliminarCurso(curso:any) {
     this.inscripcionesService.eliminarInscripcionDelAlumno(curso.id, this.alumnoId).subscribe(
      inscripcion => {

        this.cursosDelAlumno = this.cursosDelAlumno.filter((c:any)=>c.id!=curso.id)
      }
    );
  }


}
