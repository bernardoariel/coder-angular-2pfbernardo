import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ListadoComponent } from '../listado/listado.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Estudiante } from 'src/app/core/interfaces/estudiante.interface';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.component.html',
  styleUrls: ['./alumno.component.scss']
})
export class AlumnoComponent {

  nombreControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20),
    Validators.pattern(/^[^0-9]+$/)
  ])

  apellidoControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20),
    Validators.pattern(/^[^0-9]+$/)
  ])
  fechaNacimientoControl = new FormControl('', [
    Validators.required,
    // Validators.pattern(/^([0-2]\d|3[0-1])\/(0\d|1[0-2])\/\d{4}$/)
  ]);

  estudianteForm = new FormGroup({
    nombre: this.nombreControl,
    apellido: this.apellidoControl,
    fechaNacimiento: this.fechaNacimientoControl,
  })

  constructor(
    private dialogRef:MatDialogRef<ListadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { alumno?: Estudiante }
  ){
    if(data && data.alumno){
      console.log('data.alumno::: ', data.alumno);
      this.nombreControl.setValue(data.alumno.nombre)
      this.apellidoControl.setValue(data.alumno.apellido)
      this.fechaNacimientoControl.setValue(data.alumno.fechaNacimiento)
    }
  }

  myFilter = (d: Date | null): boolean => {
    const today = new Date();
    const cutoffDate = new Date("1940-01-01");

    if (!d) {
      // Si la fecha es nula, retornar falso para no permitir su selección
      return false;
    }

    // Retornar falso si la fecha es mayor a la actual o menor a la fecha límite (1940)
    return d <= today && d >= cutoffDate;
  };

  guardar(){
    if(this.estudianteForm.valid){
      const formData = this.estudianteForm.value;
      formData.fechaNacimiento = formData.fechaNacimiento ? new Date(formData.fechaNacimiento).toISOString().substring(0, 10) : null;

      this.dialogRef.close(formData);
    }else{
      this.dialogRef.close();
    }
  }

}
