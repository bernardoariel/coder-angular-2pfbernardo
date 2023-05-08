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


  foto:string = '';
  titulo!: string;

  constructor(
    private dialogRef:MatDialogRef<ListadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { curso?: Curso }
  ){
    if(data && data.curso){
      console.log('data.curso::: ', data.curso);

      this.titulo = data.curso.nombre! ;
      this.foto = data.curso.foto || '../assets/img/cursos/default.png'
    }
  }
}
