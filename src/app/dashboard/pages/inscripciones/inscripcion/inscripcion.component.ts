import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Curso } from 'src/app/core/interfaces/curso.interface';
import { CursoService } from 'src/app/core/services/curso.service';
import { Inscripcion } from 'src/app/core/services/inscripcion.service';

interface CursoOption {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.scss']
})
export class InscripcionComponent implements OnInit{

  nombreControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(30),
  ])
  cursosOptions : CursoOption[] = [];
  cursos: Curso[] = [];
  fechaInicioControl = new FormControl(new Date(), [Validators.required]);
  fechaFinControl = new FormControl(new Date(), [Validators.required]);
  selectedCursoControl = new FormControl('', [Validators.required]);
  inscripcionForm = new FormGroup({
    nombre: this.nombreControl,
    fecha_inicio: this.fechaInicioControl,
    fecha_fin: this.fechaFinControl,
    curso_id: this.selectedCursoControl
  });

  constructor(
    private dialogRef: MatDialogRef<InscripcionComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { inscripcion?: Inscripcion},
    private cursosService: CursoService
  ) {
    if (data && data.inscripcion) {
      const inscripcionParaEditar = data.inscripcion;

      this.nombreControl.setValue(inscripcionParaEditar.nombre);
      this.fechaInicioControl.setValue(inscripcionParaEditar.fecha_inicio);
      this.fechaFinControl.setValue(inscripcionParaEditar.fecha_fin);
      this.selectedCursoControl.setValue((inscripcionParaEditar.idCurso).toString());
    }
  }
  ngOnInit(): void {
    this.cursosService.getCursos().subscribe(cursos => {
      this.cursos = cursos;
      this.cursosOptions = cursos.map(curso => ({
        value: curso.id.toString(),
        viewValue: curso.nombre,
      }));
    });
  }

  guardar(){
    if(this.inscripcionForm.valid){
      this.dialogRef.close(this.inscripcionForm.value)
    }else{
      this.dialogRef.close()
    }
  }
}
