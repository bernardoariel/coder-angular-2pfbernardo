
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Inscripcion, InscripcionService } from 'src/app/core/services/inscripcion.service';
import { InscripcionComponent } from '../inscripcion/inscripcion.component';
import { DetalleComponent } from '../detalle/detalle.component';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})
export class ListadoComponent  implements OnInit , OnDestroy {

  inscripciones!: Inscripcion[] ;
  subscripcionRef!: Subscription | null
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['nombre', 'inicio','fin','acciones'];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = (filterValue as string).trim().toLowerCase();

  }
  constructor(
    private inscripcionService: InscripcionService,
    private matDialog: MatDialog
    ){

  }
  ngOnInit(): void {
    this.subscripcionRef = this.inscripcionService.getCursosNuevos().subscribe(
      (inscripciones: any[]) => {
        this.inscripciones = inscripciones;
        this.dataSource.data = inscripciones;
      })
  }
  ngOnDestroy(): void {
    this.subscripcionRef?.unsubscribe();
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
       if(formValue){
        this.inscripcionService.editarInscripcion(inscripcion.id!, formValue)
       }
      })
  }
  editariInscripcion(inscripcion:Inscripcion){

    const dialog =  this.matDialog.open(InscripcionComponent, {
     data:{
      inscripcion
     }
    })

    dialog.afterClosed()
      .subscribe((formValue) => {
       if(formValue){
        this.inscripcionService.editarInscripcion(inscripcion.id,formValue)
       }
      })
  }
  eliminarInscripcion(inscripcion:Inscripcion){

    if(confirm('Está seguro?')){
      this.inscripcionService.eliminarInscripcion(inscripcion)
    }
  }
  crearInscripcion(){
    const dialog =  this.matDialog.open(InscripcionComponent)
    let nuevaInscripcion

    dialog.afterClosed()
    .subscribe((inscripcion) => {
      if(inscripcion && Object.keys(inscripcion).length > 0) { // Verifica si el objeto inscripcion no es vacío
        nuevaInscripcion = {
          ...inscripcion,
          id: this.inscripciones.length + 1,
        }
        this.inscripcionService.crearIscripcion(nuevaInscripcion)
      }
    })
  }
}
