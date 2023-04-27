import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ListadoComponent } from '../listado/listado.component';
import { Estudiante } from 'src/app/core/interfaces/estudiante.interface';

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
  constructor(
    private dialogRef:MatDialogRef<ListadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { alumno?: Estudiante }
  ){
    if(data && data.alumno){
      console.log('data.alumno::: ', data.alumno);
      this.titulo = data.alumno.nombre + ' ' + data.alumno.apellido;
      this.avatar = data.alumno.fotoPerfilUrl
      this.foto = data.alumno.fotoPerfilUrl
      this.fechaNacimiento= data.alumno.fechaNacimiento
    }
  }
}
