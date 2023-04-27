import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inscripcion } from 'src/app/core/services/inscripcion.service';

@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.scss']
})
export class InscripcionComponent {

  nombreControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20),
    Validators.pattern(/^[^0-9]+$/)
  ])

  fechaInicioControl = new FormControl(new Date(), [Validators.required]);
  fechaFinControl = new FormControl(new Date(), [Validators.required]);
  inscripcionForm = new FormGroup({
    nombre: this.nombreControl,
    fecha_inicio: this.fechaInicioControl,
    fecha_fin: this.fechaFinControl,
  });

  constructor(
    private dialogRef: MatDialogRef<InscripcionComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { inscripcion?: Inscripcion},
  ) {
    if (data && data.inscripcion) {
      const inscripcionParaEditar = data.inscripcion;

      this.nombreControl.setValue(inscripcionParaEditar.nombre);
      this.fechaInicioControl.setValue(inscripcionParaEditar.fecha_inicio);
      this.fechaFinControl.setValue(inscripcionParaEditar.fecha_fin);
    }
  }


  guardar(){
    if(this.inscripcionForm.valid){
      this.dialogRef.close(this.inscripcionForm.value)
    }else{
      this.dialogRef.close()
    }
  }
}
