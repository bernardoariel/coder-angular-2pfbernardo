
import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, take } from 'rxjs';
import { Inscripcion, InscripcionService } from 'src/app/core/services/inscripcion.service';
import { InscripcionComponent } from '../inscripcion/inscripcion.component';
import { DetalleComponent } from '../detalle/detalle.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from '../confirm/confirm.component';
import { TitleService } from 'src/app/core/services/title.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService, Usuario } from 'src/app/core/services/auth.service';

interface InscripcionOption {
  nivelCurso: string | null;
  formatoCurso: string | null;
  id: number;
  idCurso: number;
  nombreCurso: string;
  fecha_inicio: string;
  fecha_fin: string;
  alumnosInscriptos?: number[];
  detalleCurso: string | null;
}

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})
export class ListadoComponent  implements OnInit , OnDestroy {

  inscripciones!: InscripcionOption[] ;
  subscripcionRef!: Subscription | null
  dataSource: MatTableDataSource<Inscripcion> = new MatTableDataSource();
  displayedColumns: string[] = ['nombre', 'fechas','modo','estado','acciones'];
  isLoading = true
  titulo:string = 'Click Academy';
  authUserRole!:Usuario | null;
  constructor(
    private inscripcionService: InscripcionService,
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
  getEstadoInscripcion(inscripcion: Inscripcion) {
    const hoy = new Date();
    const fechaInicio = new Date(inscripcion.fecha_inicio);
    const fechaFin = new Date(inscripcion.fecha_fin);

    if (fechaInicio > hoy) {
      return 'Próximo';
    } else if (fechaInicio <= hoy && (fechaFin >= hoy || fechaInicio.getTime() === fechaFin.getTime())) {
      return 'En Curso';
    } else {
      return 'Finalizado';
    }
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

  getDetalle(inscripcion:InscripcionOption){

    let detalle:string;
    if(inscripcion.formatoCurso && inscripcion.formatoCurso== 'Clase'){

      detalle = inscripcion.detalleCurso!.trim() + ` en ${inscripcion.nombreCurso}`
      return detalle

    }else{

      detalle = inscripcion.formatoCurso!.trim() + ` de ${inscripcion.nombreCurso} ${inscripcion.nivelCurso}`
      return detalle

    }


  }
  getFechas(inscripcion:InscripcionOption){
    let fechas:string;
    if(inscripcion.formatoCurso=='Clase'){

      fechas = `${inscripcion.fecha_inicio}`
      return fechas
    } else{
      fechas = `${inscripcion.fecha_inicio} al ${inscripcion.fecha_fin}`
      return fechas
    }

  }



}
