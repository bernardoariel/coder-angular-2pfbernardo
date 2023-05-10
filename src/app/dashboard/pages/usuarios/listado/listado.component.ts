import { Subscription } from 'rxjs';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TitleService } from 'src/app/core/services/title.service';
import { ActivatedRoute } from '@angular/router';

import {  UsuarioService } from 'src/app/core/services/usuario.service';
import { UsuarioComponent } from '../usuario/usuario.component';
import { ConfirmComponent } from '../confirm/confirm.component';
interface Usuario{
  id:number;
  idEstrudiante:number;
  password:string;
  email:string;
  role:string;
  token:string;
}
@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})
export class ListadoComponent implements OnInit, OnDestroy {
  usuarios: Usuario[] = [];
  subscripcionRef!: Subscription | null
  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();
  displayedColumns: string[] = ['email','role','avatar','acciones'];
  ultimoId: number = 0
  ultimoIdSubscription!: Subscription;
  durationInSeconds = 5;
  isLoading = true;
  titulo:string = 'Click Academy';
  constructor(
    private usuarioService: UsuarioService,
    private matDialog: MatDialog,
    private snackBar:MatSnackBar,
    private titleService: TitleService,
    private cd: ChangeDetectorRef,
    private activatedRoute:ActivatedRoute
  ) {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = (filterValue as string).trim().toLowerCase();
  }

  ngOnInit(): void {
    this.usuarioService.getUsuarios().subscribe(
      (usuarios) => {
        console.log('usuarios::: ', usuarios);
        this.usuarios = usuarios;
        this.dataSource.data = this.usuarios;
        this.isLoading = false;
      }
    )

    setTimeout(() => {
      this.activatedRoute.data.subscribe(data => {
        this.titulo = data['breadcrumb'].alias;
        console.log('this.titulo::: ', this.titulo);
        this.titleService.setTitle(this.titulo);
      });

      this.cd.detectChanges();
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.subscripcionRef) {
      this.subscripcionRef.unsubscribe();
    }
  }
  crearUsuario(){

    const dialog = this.matDialog.open(UsuarioComponent);

    dialog.afterClosed().subscribe((formValue) => {
      if(formValue){
        //TODO: cambiar idestudiante por algo mas generico para tener estudiantes profesores y admin
        const usurioNuevo = {
          ...formValue,
          "idEstudiante": null
        }
        this.usuarioService.agregarUsuario(usurioNuevo).subscribe(
          (usuario)=>{
            this.dataSource.data = (this.dataSource.data as Usuario[]).concat(usuario)
            this.snackBar.open('Usuario agregado con exito', '', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            })
          }
        )
      }
    })

  }
  eliminarUsuario(usuarioDelete: Usuario): void {
     const dialogRef =  this.matDialog.open(ConfirmComponent,{
      data: 'Está seguro que desea eliminar este Usuario?'
    })
    //TODO si idEstudiante eliminamos solo al usuario , si idEstudiante no es null eliminamos al usuario y al estudiante
    //TODO informar a quien se va a eliminar
    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.usuarioService.borrarUsuario(usuarioDelete.id!).subscribe(
        () => {
            this.dataSource.data = (this.dataSource.data as Usuario[]).filter((usuario) => usuario.id !== usuarioDelete.id);
        }
      )
    });

}
  editarUsuario(usuario: Usuario) {


    const dialog = this.matDialog.open(UsuarioComponent, {
      data: {
        usuario
      }
    });

    dialog.afterClosed().subscribe((formValue) => {

      if (formValue) {
        const alumnoEditado = {
          ...usuario,
          ...formValue
        };
        this.usuarioService.actualizarUsuario(alumnoEditado).subscribe((usuario)=>{
          const index = this.dataSource.data.findIndex(a => a.id === usuario.id);

          if (index !== -1) {
            this.dataSource.data[index] = usuario;
            this.dataSource.data = [...this.dataSource.data];
          }
        });

      }
    });
  }


  /* detalleAlumno(alumno:Usuario){

  const dialog =  this.matDialog.open(DetalleComponent, {
      data:{
        alumno
      }
     })

     dialog.afterClosed()
      .subscribe((formValue) => {
       if(formValue){
        // this.alumnoService.editarAlumno(alumno.id!, formValue)
       }
      })
  } */
}
