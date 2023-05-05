import { Component, Inject, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { distinctUntilChanged, first } from 'rxjs';
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
  selectedCursoControl = new FormControl('', [Validators.required]);
  selectedTipoCursoControl = new FormControl('', [Validators.required]);
  selectedNivelCursoControl = new FormControl('', [Validators.required]);
  cursos: Curso[] = [];
  tiposCursos: string[] = ['Presencial', 'Virtual'];
  nivelesCursos: string[] = ['Básico', 'Intermedio', 'Avanzado'];

  nivelCursoSeleccionado: string = '';
  nombreCursoSeleccionado:string = ''
  fechaInicioControl = new FormControl(new Date(), [Validators.required]);
  fechaFinControl = new FormControl(new Date(), [Validators.required]);

  inscripcionForm = new FormGroup({
    idCurso: this.selectedCursoControl,
    nombreCurso: new FormControl(this.nombreCursoSeleccionado, [Validators.required]),
    nivelCurso: this.selectedTipoCursoControl,
    fecha_inicio: this.fechaInicioControl,
    fecha_fin: this.fechaFinControl,
  });

  disabled: boolean= true
  cursosOptions!: { value: string; viewValue: string; }[];
seleccionarNivelCurso(nivel: string) {
    this.nivelCursoSeleccionado = nivel;
  }
  constructor(
    private dialogRef: MatDialogRef<InscripcionComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { inscripcion?: Inscripcion},
    private cursosService: CursoService
  ) {
    if (data && data.inscripcion) {

      const inscripcionParaEditar = data.inscripcion;

      // this.nombreControl.setValue(inscripcionParaEditar.nombre);
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
    this.selectedCursoControl.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(cursoId => {
      const cursoSeleccionado = this.cursos.find(curso => curso.id === (+cursoId! ?? -1));


      if (cursoSeleccionado) {
        console.log('cursoSeleccionado::: ', cursoSeleccionado);
        this.inscripcionForm.get('idCurso')?.setValue(cursoSeleccionado.id.toString());
        this.inscripcionForm.get('nombreCurso')?.setValue(cursoSeleccionado.nombre)
        this.nombreCursoSeleccionado = cursoSeleccionado.nombre;

        console.log('this.nombreCursoSeleccionado ::: ', this.nombreCursoSeleccionado );
      } else {
        this.inscripcionForm.get('idCurso')?.reset();
        this.inscripcionForm.get('nombreCurso')?.reset();
      }
    });
  }



  guardar(){
    console.log('this.inscripcionForm.value::: ', this.inscripcionForm.value)
    if (this.inscripcionForm.valid) {
      return;
      const fechaInicio = new Date(this.fechaInicioControl.value!);
      console.log('fechaInicio::: ', fechaInicio);
      const fechaFin = new Date(this.fechaFinControl.value!);
      console.log('fechaFin::: ', fechaFin);

      if (fechaInicio.getTime() === fechaFin.getTime()) {
        // las fechas son iguales, mostrar mensaje de error
        this.fechaFinControl.setErrors({ fechaInvalida: true });
        return;
      }

      if (fechaInicio > fechaFin) {
        // la fecha de inicio es mayor a la fecha de fin, mostrar mensaje de error
        this.fechaFinControl.setErrors({ fechaInvalida: true });
        return;
      }

      // cerrar el dialogo y enviar los datos de la inscripción
      this.dialogRef.close(this.inscripcionForm.value);
    } else {
      this.dialogRef.close();
    }

  }
}
