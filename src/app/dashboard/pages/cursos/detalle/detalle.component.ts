import { Component, Inject } from '@angular/core';
import { ListadoComponent } from '../listado/listado.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Curso } from 'src/app/core/interfaces/curso.interface';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent {
  titulo:string = 'Detalle de alumno';
  tipo:string = '';
  foto:string = '';
  fotoDefault:string = '../assets/img/cursos/default.png'
  constructor(
    private dialogRef:MatDialogRef<ListadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { curso?: Curso }
  ){
    if(data && data.curso){
      console.log('data.alumno::: ', data.curso);
      let fotoUrl = `../assets/img/cursos/${data.curso.id}.png`
      this.titulo = data.curso.nombre ;
      this.tipo = data.curso.tipo
      this.foto = (data.curso.id<10)?fotoUrl : this.fotoDefault;
    }
  }
}
