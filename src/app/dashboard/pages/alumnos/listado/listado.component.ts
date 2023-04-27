import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Estudiante } from 'src/app/core/interfaces/estudiante.interface';
import { differenceInYears } from 'date-fns';
import { Subscription } from 'rxjs';
import { AlumnoService } from 'src/app/core/services/alumno.service';
import { MatDialog } from '@angular/material/dialog';
import { AlumnoComponent } from '../alumno/alumno.component';
import { DetalleComponent } from '../detalle/detalle.component';


@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})
export class ListadoComponent implements OnInit, OnDestroy  {
  alumnos!: Estudiante[];
  subscripcionRef!: Subscription | null
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['matricula','nombreCompleto','fechaNacimiento','fotoPerfilUrl','acciones'];


  constructor(
    private alumnoService: AlumnoService,
    private matDialog: MatDialog
  ) { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = (filterValue as string).trim().toLowerCase();
  }
  ngOnInit(): void {
    this.alumnoService.getAlumnos().subscribe(
      (alumnos: any[]) => {
        this.alumnos = alumnos;
        this.dataSource.data = alumnos;
      }
    )
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

     dialog.afterClosed()
      .subscribe((alumno) => {
        if(alumno && Object.keys(alumno).length > 0) {
        this.alumnoService.crearAlumno(alumno)
        }
      })

  }
  eliminarAlumno(alumno: Estudiante): void {
    if (confirm('Está seguro?')) {
      this.alumnoService.eliminarAlumno(alumno);
    }
  }
  editarAlumno(alumno:Estudiante){

    const dialog =  this.matDialog.open(AlumnoComponent, {

      data:{
        alumno
      }
     })

     dialog.afterClosed()
      .subscribe((formValue) => {
       if(formValue){
        this.alumnoService.editarAlumno(alumno.id!, formValue)
       }
      })
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
        this.alumnoService.editarAlumno(alumno.id!, formValue)
       }
      })
  }
}
