
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Inscripcion, InscripcionService } from 'src/app/core/services/inscripcion.service';
import { InscripcionComponent } from '../inscripcion/inscripcion.component';
import { DetalleComponent } from '../detalle/detalle.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})
export class ListadoComponent  implements OnInit , OnDestroy {

  inscripciones!: Inscripcion[] ;
  subscripcionRef!: Subscription | null
  dataSource: MatTableDataSource<Inscripcion> = new MatTableDataSource();
  displayedColumns: string[] = ['nombre', 'inicio','fin','acciones'];
  isLoading = true

  constructor(
    private inscripcionService: InscripcionService,
    private matDialog: MatDialog,
    private snackBar:MatSnackBar
    ){

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = (filterValue as string).trim().toLowerCase();

  }

  ngOnInit(): void {
    this.subscripcionRef = this.inscripcionService.getInscripciones().subscribe(
      (inscripciones: any[]) => {
        this.inscripciones = inscripciones;
        this.dataSource.data = inscripciones;
        this.isLoading = false
      })
  }
  ngOnDestroy(): void {
    if (this.subscripcionRef) {
      this.subscripcionRef.unsubscribe();
    }
  }

  crearInscripcion(){
    const dialog =  this.matDialog.open(InscripcionComponent,{
        width: '450px',
      })

    dialog.afterClosed().subscribe((formValue) => {

      if (formValue && Object.keys(formValue).length > 0) {
        let nuevaInscripcion = {
          ...formValue,
          idCurso: parseInt(formValue.idCurso),
          alumnosInscriptos: []
        };
        this.inscripcionService.agregarIscripcion(nuevaInscripcion).subscribe(
          (inscripcion) => {
            this.dataSource.data = [...this.dataSource.data, inscripcion]
            this.snackBar.open('Inscripcion agregada con exito', '', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            })
          }
        )
      }
    });
  }

  eliminarInscripcion(inscripcionDelete:Inscripcion){
    const dialogRef =  this.matDialog.open(ConfirmComponent,{
      data: 'Está seguro que desea eliminar esta Inscripcion?'
    })

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.inscripcionService.borrarInscripcion(inscripcionDelete.id!).subscribe(
        () => {
            this.dataSource.data = (this.dataSource.data as Inscripcion[])
            .filter((inscripcion) => inscripcion.id !== inscripcionDelete.id);
        }
    )
    });



  }
  editariInscripcion(inscripcion:Inscripcion){

    const dialog =  this.matDialog.open(InscripcionComponent, {
     width: '450px',
     data:{
      inscripcion
     }
    })

    dialog.afterClosed().subscribe((formValue) => {

      if (formValue) {
        const inscripcionEditado = {
          ...inscripcion,
          ...formValue
        };
        this.inscripcionService.actualizarInscripcion(inscripcionEditado).subscribe((inscrip)=>{
          console.log('alumno::: ', inscrip);
          const index = this.dataSource.data.findIndex(a => a.id === inscrip.id);
          if (index !== -1) {
            this.dataSource.data[index] = inscrip;
            this.dataSource.data = [...this.dataSource.data];
          }
        })
      }
    })
  }

  detalleInscripcion(inscripcion:Inscripcion){

    const dialog =  this.matDialog.open(DetalleComponent, {
     width: '600px',
      data:{
        inscripcion
      }

    })

     dialog.afterClosed()
      .subscribe((formValue) => {
        console.log('formValue::: ', formValue);
        if(formValue){
          this.subscripcionRef = this.inscripcionService.getInscripciones().subscribe(
            (inscripciones: any[]) => {
              this.inscripciones = inscripciones;
              this.dataSource.data = inscripciones;
            })
        }
      })
  }





}
