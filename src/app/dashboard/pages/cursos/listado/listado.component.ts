import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, concatMap, delay, interval, map, of } from 'rxjs';


import { CursoService } from 'src/app/core/services/curso.service';
import { obtenerCursos } from '../datos-curso_promise';
import { Curso } from 'src/app/core/interfaces/curso.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CursoComponent } from '../curso/curso.component';
import { DetalleComponent } from '../detalle/detalle.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from '../confirm/confirm.component';


@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})
export class ListadoComponent  implements OnInit , OnDestroy{

  cursos: Curso[] = [];
  subscripcionRef!: Subscription | null

  dataSource: MatTableDataSource<Curso> = new MatTableDataSource();
  displayedColumns: string[] = ['nombre', 'tipo','acciones'];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = (filterValue as string).trim().toLowerCase();

  }
  constructor(
    private cursoService: CursoService,
    private matDialog: MatDialog,
    private snackBar:MatSnackBar
    ){

  }
  ngOnDestroy(): void {
    if (this.subscripcionRef) {
      this.subscripcionRef.unsubscribe();
    }
  }

  ngOnInit(): void {
   this.cursoService.getCursos().subscribe((cursos) => {
      this.cursos = cursos
      this.dataSource.data = cursos
    })
  }
  crearCurso(){
    const dialog =  this.matDialog.open(CursoComponent)

    dialog.afterClosed()
    .subscribe((formValue) => {
        if(formValue && Object.keys(formValue).length > 0) {
          let nuevoCurso = {
          ...formValue,
        }
        this.cursoService.agregarCurso(nuevoCurso).subscribe(
          (curso) => {
            this.dataSource.data = (this.dataSource.data as Curso[])
              .concat(curso)
            this.snackBar.open('Curso agregado con exito', '', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            })
          }
        )
      }
    })
  }
  eliminarCurso(cursoDelete:Curso){

    const dialogRef =  this.matDialog.open(ConfirmComponent,{
      data: 'Está seguro que desea eliminar este Curso?'
    })
    dialogRef.afterClosed().subscribe(result => {

      if(!result) return;
      this.cursoService.borrarCurso(cursoDelete.id!).subscribe(
        () => {
            this.dataSource.data = (this.dataSource.data as Curso[])
            .filter(
              (curso) => curso.id !== cursoDelete.id);
        }
      )
    });

  }
  editarCurso(curso:Curso){
    console.log('curso::: ', curso);
    const dialog =  this.matDialog.open(CursoComponent, {
     data:{
        curso
     }
    })

    dialog.afterClosed().subscribe((formValue) => {
       if(formValue){
        const cursoEditado = {
          ...curso,
          ...formValue
        }
        this.cursoService.actualizarCurso(cursoEditado).subscribe(
          (curso)=>{
            this.dataSource.data = (this.dataSource.data as Curso[])
            .map(
              (curso) => curso.id === cursoEditado.id ? cursoEditado : curso
            )
          }
        )
       }
      })
  }
  detalleCurso(curso:Curso){
    const dialog =  this.matDialog.open(DetalleComponent, {
      data:{
        curso
      }
     })

     dialog.afterClosed()
      .subscribe((formValue) => {
       if(formValue){
        // this.cursoService.editarCurso(curso.id!, formValue)
       }
      })
  }
}
