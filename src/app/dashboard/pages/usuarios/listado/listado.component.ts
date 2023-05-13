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
import { AlumnoService } from 'src/app/core/services/alumno.service';
import { Estudiante } from 'src/app/core/interfaces/estudiante.interface';
interface Usuario{
  id:number;
  idEstudiante:number;
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
    private activatedRoute:ActivatedRoute,
    private alumnoService:AlumnoService
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

  obtenerFechaActual(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  console.log('formattedDate::: ', formattedDate);
  return formattedDate;
}

  crearUsuario(){

    const dialog = this.matDialog.open(UsuarioComponent);
    this.alumnoService.getUltimoAlumno().subscribe((ultimoAlumno) => {
      this.ultimoId = ultimoAlumno.id || 0;
    });
    dialog.afterClosed().subscribe((formValue) => {
      console.log('formValue::: ', formValue);

      if(formValue  && Object.keys(formValue).length > 0){
        const alumnoNuevo = {
          ...formValue,
          fotoPerfilUrl: `https://media.istockphoto.com/id/1187982064/es/vector/silueta-de-un-hombre-con-un-signo-de-interrogaci%C3%B3n.jpg?s=170667a&w=0&k=20&c=M3JyMP994NWFJRBBzahD2uJAIwgezLNpD6LNmJou_do=`,
          fotoUrl: `https://media.istockphoto.com/id/1187982064/es/vector/silueta-de-un-hombre-con-un-signo-de-interrogaci%C3%B3n.jpg?s=170667a&w=0&k=20&c=M3JyMP994NWFJRBBzahD2uJAIwgezLNpD6LNmJou_do=`,
          nombre: 'user',
          apellido: 'user',
          fechaNacimiento: this.obtenerFechaActual(),
          genero: 'No especificado',
          dni: '00000000',
        };
        this.alumnoService.agregarAlumno(alumnoNuevo).subscribe(
          (alumno) =>{
            // this.dataSource.data = (this.dataSource.data as Usuario[]).concat(alumno)
            this.usuarioService.getUsuarios().subscribe(
              (usuarios) => {
                console.log('usuarios::: ', usuarios);
                this.usuarios = usuarios;
                this.dataSource.data = this.usuarios;
                this.isLoading = false;
              }
            )
            this.snackBar.open('Estudiante agregado con exito', '', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            })
          }
        )
      }
    });
  }
  eliminarUsuario(usuarioDelete: Usuario): void {
    console.log('usuarioDelete::: ', usuarioDelete);

     const dialogRef =  this.matDialog.open(ConfirmComponent,{
      data: 'Está seguro que desea eliminar este Usuario?'
    })
    //TODO si idEstudiante eliminamos solo al usuario , si idEstudiante no es null eliminamos al usuario y al estudiante
    //TODO informar a quien se va a eliminar
    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.usuarioService.borrarUsuario(usuarioDelete.id!).subscribe(
        () => {
          this.alumnoService.borrarAlumno(usuarioDelete.idEstudiante).subscribe(
            ()=>{
             console.log('usuario eliminado');
            }
          )
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
            this.alumnoService.actualizarPropiedades(alumnoEditado.id,alumnoEditado.email,alumnoEditado.role).subscribe(
              (resultado) => {
                console.log('Resultado de la operación adicional en usuariosService:', resultado);
                // Realizar cualquier acción necesaria con el resultado de la operación adicional en usuariosService
              }
            )
          }
        });

      }
    });
  }


}
