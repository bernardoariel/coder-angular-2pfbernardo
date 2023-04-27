import { Component , Inject} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ListadoComponent } from '../listado/listado.component';
import { Curso } from 'src/app/core/interfaces/curso.interface';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.scss']
})
export class CursoComponent {

  nombreControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20),
    Validators.pattern(/^[^0-9]+$/)
  ])

  tipoControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20),
    Validators.pattern(/^[^0-9]+$/)
  ])
  cursoForm = new FormGroup({
    nombre: this.nombreControl,
    tipo: this.tipoControl
  })
  constructor(
    private dialogRef:MatDialogRef<ListadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { curso?: Curso }
  ){
    if(data && data.curso){
      this.nombreControl.setValue(data.curso.nombre)
      this.tipoControl.setValue(data.curso.tipo)
    }
  }

  guardar(){
    if(this.cursoForm.valid){
      this.dialogRef.close(this.cursoForm.value)
    }else{
      this.dialogRef.close()
    }
  }
}
