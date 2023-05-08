import { ChangeDetectorRef, Component, Inject, OnInit, SimpleChanges } from '@angular/core';
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
  isCursoSelected: boolean = true;
  /* controles */
  selectedCursoControl = new FormControl('', [Validators.required]);
  selectedFormatoCursoControl = new FormControl('Curso', [Validators.required]);
  selectedNivelCursoControl = new FormControl('Básico', [Validators.required]);
  selectedTipoCursoControl = new FormControl('Presencial', [Validators.required]);
  fechaInicioControl = new FormControl(new Date().toISOString().substring(0, 10), [Validators.required]);
  fechaFinControl = new FormControl(new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().substring(0, 10), [Validators.required])
  detalleControl =  new FormControl('' ,(!this.isCursoSelected) ? [Validators.required] : [])
  // detalleControl = new FormControl(null);

  /* valores para los controles */
  cursos: Curso[] = [];
  nivelesCursos: string[] = ['Básico', 'Intermedio', 'Avanzado'];
  tiposCursos: string[] = ['Presencial', 'Virtual'];
  formatoCurso: string[] = ['Curso', 'Clase'];
  nivelCursoSeleccionado: string = ''
  nombreCursoSeleccionado:string = ''

 /* form */
  inscripcionForm = new FormGroup({
    idCurso: this.selectedCursoControl,
    detalleCurso: this.detalleControl,
    formatoCurso: this.selectedFormatoCursoControl,
    nombreCurso: new FormControl(this.nombreCursoSeleccionado, [Validators.required]),
    nivelCurso: this.selectedNivelCursoControl,
    tipoCurso: this.selectedTipoCursoControl,
    fecha_inicio: this.fechaInicioControl,
    fecha_fin: this.fechaFinControl
  });

  fechaInicioInvalida = false;
  fechaFinInvalida = false;
  // disabled: boolean= true
  cursosOptions!: { value: string; viewValue: string; }[];

  seleccionarNivelCurso(nivel: string) {
    console.log('nivel::: ', nivel);
    this.selectedNivelCursoControl.setValue(nivel);
  }

  seleccionarTipoCurso(tipo: string) {
    console.log('tipo::: ', tipo);
    this.selectedTipoCursoControl.setValue(tipo);
  }
  seleccionarFormatoCurso(formato: string) {
    console.log('formato::: ', formato);
    this.selectedFormatoCursoControl.setValue(formato);
    (formato === 'Curso') ? this.isCursoSelected = true : this.isCursoSelected = false;
  }
  constructor(
    private dialogRef: MatDialogRef<InscripcionComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { inscripcion?: Inscripcion},
    private cursosService: CursoService
  ) {

    if (data && data.inscripcion) {

      const inscripcionParaEditar = data.inscripcion;
      this.fechaInicioControl.setValue(inscripcionParaEditar.fecha_inicio);
      this.fechaFinControl.setValue(inscripcionParaEditar.fecha_fin);
      this.selectedCursoControl.setValue((inscripcionParaEditar.idCurso).toString());
      this.nombreCursoSeleccionado = inscripcionParaEditar.nombreCurso as string;
      this.selectedNivelCursoControl.setValue(inscripcionParaEditar.nivelCurso as string);
      this.selectedTipoCursoControl.setValue(inscripcionParaEditar.tipoCurso as string);

      if (inscripcionParaEditar.formatoCurso == 'Curso' ) {
        this.isCursoSelected = true;
        /* this.detalleControl.setValue(inscripcionParaEditar.detalleCurso);
        this.selectedFormatoCursoControl.setValue('Clase'); */
      }else{
        this.detalleControl.setValue(inscripcionParaEditar.detalleCurso as string);
        this.isCursoSelected = false;
      }
      console.log('this.isCursoSelected::: ', this.isCursoSelected);
    }

    this.fechaInicioInvalida = false;
    this.fechaFinInvalida = false;

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



  guardar() {
    const fechaInicio = new Date(this.inscripcionForm.get('fecha_inicio')!.value!);
    console.log('this.inscripcionForm::: ', this.inscripcionForm);
    const fechaFin = new Date(this.inscripcionForm.get('fecha_fin')!.value!);
    const formatoCursoForm = this.inscripcionForm.get('formatoCurso')!.value!;
    if (fechaInicio.getTime() === fechaFin.getTime() && formatoCursoForm=='Curso') {
      console.log('a1aa')
      this.fechaInicioInvalida = true;
      this.fechaFinInvalida = true;
      this.inscripcionForm.get('fecha_inicio')!.setErrors({ fechaInvalida: true });
      this.inscripcionForm.get('fecha_fin')!.setErrors({ fechaInvalida: true });
      return;
    }

    if (fechaInicio > fechaFin && formatoCursoForm=='Curso') {
      console.log('a2aa')
     this.fechaInicioInvalida = true;
     this.fechaFinInvalida = true;
     this.inscripcionForm.get('fecha_inicio')!.setErrors({ fechaInvalida: true });
     this.inscripcionForm.get('fecha_fin')!.setErrors({ fechaInvalida: true });
     return;
    }

    console.log('this.inscripcionForm.valid::: ', this.inscripcionForm.valid);
    this.inscripcionForm.patchValue({
      fecha_inicio: fechaInicio.toISOString().substring(0, 10),
      fecha_fin: fechaFin.toISOString().substring(0, 10),
      nombreCurso: this.nombreCursoSeleccionado
    });
    console.log('valores', this.inscripcionForm.value);
    if (this.inscripcionForm.valid) {
      // Resto del código

      this.dialogRef.close(this.inscripcionForm.value);
    }
  }

}
