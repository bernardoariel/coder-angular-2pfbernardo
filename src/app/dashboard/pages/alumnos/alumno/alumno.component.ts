import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ListadoComponent } from '../listado/listado.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Estudiante } from 'src/app/core/interfaces/estudiante.interface';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { AuthService, Usuario } from 'src/app/core/services/auth.service';
import { take } from 'rxjs';

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
  ]);
  emailControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  selectedGeneroControl = new FormControl('No especificado', [Validators.required]);
  dniControl = new FormControl('', [
    Validators.required,
    Validators.minLength(7),
    Validators.maxLength(15),
    Validators.pattern(/^[0-9]+$/)
  ])
  selectedRoleControl = new FormControl('Estudiante', [
    Validators.required,
  ])
  generoEstudiante: string[] = ['Masculino', 'Femenino', 'No especificado'];
  tipoRole: string[] = ['Estudiante', 'Admin', 'Profesor'];

  valorEmail: string = '';
  estudianteForm = new FormGroup({
    nombre: this.nombreControl,
    apellido: this.apellidoControl,
    fechaNacimiento: this.fechaNacimientoControl,
    genero: this.selectedGeneroControl,
    dni: this.dniControl,
    email:this.emailControl,
    role:this.selectedRoleControl
  })
  authUserRole: Usuario | null = null;

  seleccionarGenero(genero: string) {

      this.selectedGeneroControl.setValue(genero);

  }
  seleccionarRol(rol: string) {

      this.selectedRoleControl.setValue(rol);

  }
  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private dialogRef:MatDialogRef<ListadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { alumno?: Estudiante }
  ){
    if(data && data.alumno){
      console.log('data.alumno::: ', data.alumno);
      this.nombreControl.setValue(data.alumno.nombre)
      this.apellidoControl.setValue(data.alumno.apellido)
      this.fechaNacimientoControl.setValue(data.alumno.fechaNacimiento)

      this.selectedGeneroControl.setValue(data.alumno.genero)
      this.dniControl.setValue(data.alumno.dni)
      this.selectedRoleControl.setValue(data.alumno.role)

      this.usuarioService.getUsuarioByIdestudiante(data.alumno.id!).subscribe(usuario => {

        this.emailControl.setValue(usuario[0].email)
      })
      this.authService.obtenerUsuarioAutenticado().pipe(take(1)).subscribe(
        (usuario: Usuario | null) => {
          console.log('Usuario::: ', usuario);
          this.authUserRole = usuario;
          if(this.authUserRole?.role == 'Estudiante'){
            this.tipoRole = ['Estudiante'];
          }else if(this.authUserRole?.role == 'Profesor'){
            this.tipoRole = ['Profesor'];
          }
          console.log('Valor de authUser:', this.authUserRole?.role);
        }
      );

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
      console.log('formData::: ', formData);

      this.dialogRef.close(formData);

    }else{

      this.dialogRef.close();

    }
  }

}
