import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ListadoComponent } from '../listado/listado.component';
import { Usuario } from 'src/app/core/services/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent {
  emailControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  passwordControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20)
  ])

  selectedRoleControl = new FormControl('Estudiante', [
    Validators.required,
  ])


  tipoRole: string[] = ['Estudiante', 'Admin', 'Profesor'];

  valorEmail: string = '';
  usuarioForm = new FormGroup({
    email: this.emailControl,
    password: this.passwordControl,
    role:this.selectedRoleControl
  })


  seleccionarRol(rol: string) {

      this.selectedRoleControl.setValue(rol);

  }
  constructor(
    private usuarioService: UsuarioService,
    private dialogRef:MatDialogRef<ListadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { usuario?: Usuario }
  ){
    if(data && data.usuario){

      this.emailControl.setValue(data.usuario.email)
      this.passwordControl.setValue(data.usuario.password)
      this.selectedRoleControl.setValue(data.usuario.role)
      //TODO : SI EL usuario es un se crea desde abm de usuario, el usuario esta incompleto, entonces tendra que ingresar y lo llevara a la pantalla de editar usuario para completar los datos
      /* this.usuarioService.getUsuarioByIdestudiante(data.alumno.id!).subscribe(usuario => {

        this.emailControl.setValue(usuario[0].email)
      }) */


    }
  }



  guardar(){
    if(this.usuarioForm.valid){
      //TODO: Buscar si existe un usuario con ese email
      this.dialogRef.close(this.usuarioForm.value);

    }else{

      this.dialogRef.close();

    }
  }
}
