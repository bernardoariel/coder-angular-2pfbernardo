import { Subscription } from 'rxjs';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TitleService } from 'src/app/core/services/title.service';
import { ActivatedRoute } from '@angular/router';

import {  UsuarioService } from 'src/app/core/services/usuario.service';
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



 crearAlumno(){

   /*  const dialog = this.matDialog.open(AlumnoComponent);
    this.alumnoService.getUltimoAlumno().subscribe((ultimoAlumno) => {
      this.ultimoId = ultimoAlumno.id || 0;
    });
    dialog.afterClosed().subscribe((formValue) => {

      if(formValue  && Object.keys(formValue).length > 0){
        const alumnoNuevo = {
          ...formValue,
          fotoPerfilUrl:`https://randomuser.me/api/portraits/med/men/${this.ultimoId + 1}.jpg`,
          fotoUrl: `https://randomuser.me/api/portraits/men/${this.ultimoId + 1}.jpg`,
        }
        this.alumnoService.agregarAlumno(alumnoNuevo).subscribe(
          (alumno) =>{
            this.dataSource.data = (this.dataSource.data as Estudiante[]).concat(alumno)
            this.snackBar.open('Estudiante agregado con exito', '', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            })
          }
        )
      }
    }); */
  }
  eliminarAlumno(alumnoDelete: Usuario): void {
   /*  const dialogRef =  this.matDialog.open(ConfirmComponent,{
      data: 'Está seguro que desea eliminar este Alumno?'
    })
    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.alumnoService.borrarAlumno(alumnoDelete.id!).subscribe(
        () => {
            this.dataSource.data = (this.dataSource.data as Estudiante[]).filter((alumno) => alumno.id !== alumnoDelete.id);
        }
      )
    }); */

}
  editarAlumno(alumno: Usuario) {

   /*  const dialog = this.matDialog.open(AlumnoComponent, {
      data: {
        alumno
      }
    });

    dialog.afterClosed().subscribe((formValue) => {

      if (formValue) {
        const alumnoEditado = {
          ...alumno,
          ...formValue
        };
        this.alumnoService.actualizarAlumno(alumnoEditado).subscribe((alumno)=>{
          console.log('alumno::: ', alumno);
          const index = this.dataSource.data.findIndex(a => a.id === alumno.id);
          if (index !== -1) {
            this.dataSource.data[index] = alumno;
            this.dataSource.data = [...this.dataSource.data];
          }
        });

      }
    }); */
  }


  detalleAlumno(alumno:Usuario){

   /*  const dialog =  this.matDialog.open(DetalleComponent, {
      data:{
        alumno
      }
     })

     dialog.afterClosed()
      .subscribe((formValue) => {
       if(formValue){
        // this.alumnoService.editarAlumno(alumno.id!, formValue)
       }
      }) */
  }
}
