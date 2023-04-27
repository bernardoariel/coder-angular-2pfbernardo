import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, concatMap, delay, interval, map, of } from 'rxjs';


import { CursoService } from 'src/app/core/services/curso.service';
import { obtenerCursos } from '../datos-curso_promise';
import { Curso } from 'src/app/core/interfaces/curso.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CursoComponent } from '../curso/curso.component';
import { DetalleComponent } from '../detalle/detalle.component';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})
export class ListadoComponent  implements OnInit , OnDestroy{

  cursos!: Curso[] ;
  cursosObs!: Curso[];

  subscripcionRef!: Subscription | null
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['nombre', 'tipo','acciones'];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = (filterValue as string).trim().toLowerCase();

  }
  constructor(
    private cursoService: CursoService,
    private matDialog: MatDialog
    ){

  }
  ngOnDestroy(): void {
    this.subscripcionRef?.unsubscribe();
  }

  ngOnInit(): void {
    const cursosPromises = obtenerCursos();
    cursosPromises.then(cursos => {
      this.cursos = cursos;
    });
    this.subscripcionRef = interval(1000)
      .pipe(concatMap(() => this.cursoService.getCursos().pipe(
        map((cursos: any[]) => cursos.map(curso => ({...curso, nombre: curso.nombre.toUpperCase()}))),
        concatMap(c => of(c).pipe(delay(100)))
      ))).subscribe(cursos => {

        this.dataSource.data = cursos;
      });
  }
  crearCurso(){
    const dialog =  this.matDialog.open(CursoComponent)
    let nuevoCurso
    dialog.afterClosed()
    .subscribe((curso) => {
        if(curso && Object.keys(curso).length > 0) {
        nuevoCurso = {
          ...curso,
          id: this.cursos.length + 1,
        }
        this.cursoService.crearCurso(nuevoCurso)
      }
      })
  }
  eliminarCurso(curso:Curso){
    console.log('curso::: ', curso);
    if(confirm('Está seguro?')){
      this.cursoService.eliminarCurso(curso)
    }
  }
  editarCurso(curso:Curso){
    console.log('curso::: ', curso);
    const dialog =  this.matDialog.open(CursoComponent, {
     data:{
        curso
     }
    })

    dialog.afterClosed()
      .subscribe((formValue) => {
       if(formValue){
        this.cursoService.editarCurso(curso.id,formValue)
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
        this.cursoService.editarCurso(curso.id!, formValue)
       }
      })
  }
}
