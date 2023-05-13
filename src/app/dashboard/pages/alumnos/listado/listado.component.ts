import { AuthService, Usuario } from 'src/app/core/services/auth.service';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Estudiante } from 'src/app/core/interfaces/estudiante.interface';
import { differenceInYears } from 'date-fns';
import { Subject, Subscription, take } from 'rxjs';
import { AlumnoService } from 'src/app/core/services/alumno.service';
import { MatDialog } from '@angular/material/dialog';
import { AlumnoComponent } from '../alumno/alumno.component';
import { DetalleComponent } from '../detalle/detalle.component';
import { id } from 'date-fns/locale';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from '../confirm/confirm.component';
import { TitleService } from 'src/app/core/services/title.service';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/core/services/usuario.service';


@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})
export class ListadoComponent implements OnInit, OnDestroy  {
  alumnos: Estudiante[] = [];
  subscripcionRef!: Subscription | null
  dataSource: MatTableDataSource<Estudiante> = new MatTableDataSource();
  displayedColumns: string[] = ['matricula','nombreCompleto','sexo','fechaNacimiento','fotoPerfilUrl','acciones'];
  ultimoId: number = 0
  ultimoIdSubscription!: Subscription;
  durationInSeconds = 5;
  isLoading = true;
  titulo:string = 'Click Academy';
  authUserRole!:Usuario | null;

  constructor(
    private alumnoService: AlumnoService,
    private matDialog: MatDialog,
    private snackBar:MatSnackBar,
    private titleService: TitleService,
    private cd: ChangeDetectorRef,
    private activatedRoute:ActivatedRoute,
    private authService:AuthService,
    private usuarioService:UsuarioService,
  ) {
    this.authService.obtenerUsuarioAutenticado().pipe(take(1)).subscribe(
      (usuario: Usuario | null) => {
        console.log('Usuario::: ', usuario);
        this.authUserRole = usuario;

        console.log('Valor de authUser:', this.authUserRole?.role);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = (filterValue as string).trim().toLowerCase();
  }

  ngOnInit(): void {
    this.alumnoService.getAlumnos().subscribe((alumnos) => {
      this.alumnos = alumnos
      this.dataSource.data = alumnos;
      this.isLoading = false;
    })
    setTimeout(() => {
      this.activatedRoute.data.subscribe(data => {
        this.titulo = data['breadcrumb'].alias;
        console.log('this.titulo::: ', this.titulo);
        this.titleService.setTitle(this.titulo);
      });

      // this.titleService.setTitle('/dashboard/alumnos/listado');
      this.cd.detectChanges();
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.subscripcionRef) {
      this.subscripcionRef.unsubscribe();
    }
  }
  getColorForSexo(sexo: string) {
    switch (sexo) {
      case 'Masculino':
        return 'blue';
      case 'Femenino':
        return 'pink';
      case 'No especificado':
        return 'violet';
      default:
        return 'black';
    }
  }
  calcularEdad(fechaNacimiento: string): number {
    const fechaNacimientoDate = new Date(fechaNacimiento);
    const hoy = new Date();
    return differenceInYears(hoy, fechaNacimientoDate);
  }

 crearAlumno(){

    const dialog = this.matDialog.open(AlumnoComponent);
    this.alumnoService.getUltimoAlumno().subscribe((ultimoAlumno) => {
      this.ultimoId = ultimoAlumno.id || 0;
    });
    dialog.afterClosed().subscribe((formValue) => {
      console.log('formValue::: ', formValue.genero);

      let foto1:string =''
      let foto2:string = ''
      switch (formValue.genero) {
        case "Masculino":
          foto1= `https://randomuser.me/api/portraits/med/men/${this.ultimoId + 1}.jpg`
          foto2= `https://randomuser.me/api/portraits/men/${this.ultimoId + 1}.jpg`
          break;
        case "Femenino":
          foto1= `https://randomuser.me/api/portraits/med/women/${this.ultimoId + 1}.jpg`;
          foto2= `https://randomuser.me/api/portraits/women/${this.ultimoId + 1}.jpg`;
          break;
        case 'No especificado':
          foto1 =`https://randomuser.me/api/portraits/lego/1.jpg`
          foto2= `https://randomuser.me/api/portraits/lego/1.jpg`
          break;
      }
      if(formValue  && Object.keys(formValue).length > 0){
        const alumnoNuevo = {
          ...formValue,
          fotoPerfilUrl:foto1,
          fotoUrl:foto2,
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
    });
  }
  eliminarAlumno(alumnoDelete: Estudiante): void {
    const dialogRef =  this.matDialog.open(ConfirmComponent,{
      data: 'Está seguro que desea eliminar este Alumno?'
    })
    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.alumnoService.borrarAlumno(alumnoDelete.id!).subscribe(
        () => {
          this.usuarioService.borrarUsuario(alumnoDelete.id!).subscribe(
            ()=>{
             console.log('usuario eliminado');
            }
          )
            this.dataSource.data = (this.dataSource.data as Estudiante[]).filter((alumno) => alumno.id !== alumnoDelete.id);
        }
      )

    });

}
  editarAlumno(alumno: Estudiante) {

    const dialog = this.matDialog.open(AlumnoComponent, {
      data: {
        alumno
      }
    });

    dialog.afterClosed().subscribe((formValue) => {
      console.log('valor del form::: ', formValue.genero);
      let foto1:string =''
      let foto2:string = ''
      switch (formValue.genero) {
        case "Masculino":
          foto1= `https://randomuser.me/api/portraits/med/men/${alumno.id}.jpg`
          foto2= `https://randomuser.me/api/portraits/men/${alumno.id}.jpg`
          break;
        case "Femenino":
          foto1= `https://randomuser.me/api/portraits/med/women/${alumno.id}.jpg`;
          foto2= `https://randomuser.me/api/portraits/women/${alumno.id}.jpg`;
          break;
        case 'No especificado':
          foto1 =`https://randomuser.me/api/portraits/lego/1.jpg`
          foto2= `https://randomuser.me/api/portraits/lego/1.jpg`
          break;
      }


      if (formValue) {
        console.log('formValue::: ', formValue);

        const alumnoEditado = {
          ...alumno,
          ...formValue,
          fotoPerfilUrl:foto1,
          fotoUrl:foto2,
        };

        this.alumnoService.actualizarAlumno(alumnoEditado).subscribe((alumno)=>{
          console.log('alumno::: ', alumno);
          const index = this.dataSource.data.findIndex(a => a.id === alumno.id);
          if (index !== -1) {
            this.dataSource.data[index] = alumno;
            this.dataSource.data = [...this.dataSource.data];
            this.usuarioService.actualizarPropiedades(alumnoEditado.id,formValue.email, formValue.role).subscribe(
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


  detalleAlumno(alumno:Estudiante){

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
  }
}
