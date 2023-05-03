import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Estudiante } from 'src/app/core/interfaces/estudiante.interface';
import { differenceInYears } from 'date-fns';
import { Subject, Subscription } from 'rxjs';
import { AlumnoService } from 'src/app/core/services/alumno.service';
import { MatDialog } from '@angular/material/dialog';
import { AlumnoComponent } from '../alumno/alumno.component';
import { DetalleComponent } from '../detalle/detalle.component';
import { id } from 'date-fns/locale';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from '../confirm/confirm.component';


@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})
export class ListadoComponent implements OnInit, OnDestroy  {
  alumnos: Estudiante[] = [];
  subscripcionRef!: Subscription | null
  dataSource: MatTableDataSource<Estudiante> = new MatTableDataSource();
  displayedColumns: string[] = ['matricula','nombreCompleto','fechaNacimiento','fotoPerfilUrl','acciones'];
  ultimoId: number = 0
  ultimoIdSubscription!: Subscription;
  durationInSeconds = 5;

  constructor(
    private alumnoService: AlumnoService,
    private matDialog: MatDialog,
    private snackBar:MatSnackBar
  ) { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = (filterValue as string).trim().toLowerCase();
  }

  ngOnInit(): void {
    this.alumnoService.getAlumnos().subscribe((alumnos) => {
      this.alumnos = alumnos
      this.dataSource.data = alumnos;
    })
  }

  ngOnDestroy(): void {
    if (this.subscripcionRef) {
      this.subscripcionRef.unsubscribe();
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
