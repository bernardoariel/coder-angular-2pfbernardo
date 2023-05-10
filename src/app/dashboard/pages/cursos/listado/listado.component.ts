import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription, take } from 'rxjs';


import { CursoService } from 'src/app/core/services/curso.service';
import { Curso } from 'src/app/core/interfaces/curso.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CursoComponent } from '../curso/curso.component';
import { DetalleComponent } from '../detalle/detalle.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from '../confirm/confirm.component';
import { TitleService } from 'src/app/core/services/title.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService, Usuario } from 'src/app/core/services/auth.service';


@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})
export class ListadoComponent  implements OnInit , OnDestroy{

  cursos: Curso[] = [];
  subscripcionRef!: Subscription | null

  dataSource: MatTableDataSource<Curso> = new MatTableDataSource();
  displayedColumns: string[] = ['nombre', 'foto','acciones'];
  isLoading = true
  titulo:string = 'Click Academy';
  authUserRole!:Usuario | null;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = (filterValue as string).trim().toLowerCase();

  }
  constructor(
    private cursoService: CursoService,
    private matDialog: MatDialog,
    private snackBar:MatSnackBar,
    private titleService: TitleService,
    private cd: ChangeDetectorRef,
    private activatedRoute:ActivatedRoute,
    private authService:AuthService
    ){
      this.authService.obtenerUsuarioAutenticado().pipe(take(1)).subscribe(
        (usuario: Usuario | null) => {
          console.log('Usuario::: ', usuario);
          this.authUserRole = usuario;

        }
      );
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
      this.isLoading = false
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
