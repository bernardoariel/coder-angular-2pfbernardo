import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ListadoComponent } from '../listado/listado.component';
import { Inscripcion, InscripcionService } from 'src/app/core/services/inscripcion.service';
import { CursoService } from 'src/app/core/services/curso.service';
import { AlumnoService } from 'src/app/core/services/alumno.service';
import { Estudiante } from 'src/app/core/interfaces/estudiante.interface';
import { AuthService, Usuario } from 'src/app/core/services/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent {
  titulo:string = '';
  tipo:string = '';
  foto:string = './assets/foto.js';
  fotoDefault:string = '../assets/img/cursos/default.png'
  courseId:number = 0;
  idInscripcion: number = 0;
  nombreCurso:string = '';
  alumnos: Estudiante[] = [];
  alumnosNoInscriptos: Estudiante[] = [];
  alumnosTodos: Estudiante[] | undefined;
  alumnosInscriptos: Estudiante[] = []
  fechaFin!:Date
  esFechaFinAnteriorAHoy: boolean = false;
  isNotFinalized: boolean = false;
  authUserRole!:Usuario | null;
  estoyInscripto:boolean = false
  nrosAlumnoInscripto?:number[] = []
  constructor(
    private dialogRef:MatDialogRef<ListadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { inscripcion?: Inscripcion },
    private cursoService:CursoService,
    private alumnosService:AlumnoService,
    private inscripcionesService:InscripcionService,
    private authService: AuthService
  ){
    if(data && data.inscripcion){
      console.log('data.inscripcion::: ', data.inscripcion);
      

      this.titulo = data.inscripcion.nombre ; //tengo el nombre
      this.idInscripcion = data.inscripcion.id; //tengo el id de la inscripcion o curso a inscribir
      this.foto = '../assets/img/cursos/default.png'
      const hoy = new Date();
      const fechaFin = data.inscripcion?.fecha_fin;
      if (fechaFin) {
        const fechaFinDate = new Date(fechaFin);
        const fechaHoyString = hoy.toISOString().substr(0, 10);

        if (fechaFinDate.toISOString().substr(0, 10) === fechaHoyString) {
          // La fecha de hoy es igual a la fecha de finalización
          this.esFechaFinAnteriorAHoy = false;
          this.isNotFinalized = false;
        } else if (fechaFinDate < hoy) {
          // La fecha de finalización es anterior a la fecha de hoy
          this.esFechaFinAnteriorAHoy = true;
           this.isNotFinalized = true;
        } else {
          // La fecha de finalización es posterior a la fecha de hoy
this.esFechaFinAnteriorAHoy = false;
 this.isNotFinalized = false;
        }
      }


      this.nrosAlumnoInscripto = data.inscripcion.alumnosInscriptos
      const courseId = data.inscripcion?.courseId;

      if (courseId) {

        this.cursoService.getCursoById(courseId).subscribe(
          curso => {
          
            this.courseId = curso!.id
            this.nombreCurso = curso?.nombre ?? 'No encontrado'
            this.foto = curso?.foto!

          }
        )
      }
      this.alumnosService.getAlumnos().subscribe(
        alumnos => {
          this.alumnosTodos = alumnos;
          this.alumnosNoInscriptos = alumnos.filter(alumno => {
          // Agrega una condición adicional para filtrar por un campo distinto de 'user'
          return alumno.nombre !== 'user' && !data.inscripcion?.alumnosInscriptos?.find(a => a === alumno.id);
        });
        this.alumnosInscriptos = alumnos.filter(alumno => {
          // Agrega una condición adicional para filtrar por un campo distinto de 'user'
          return alumno.nombre !== 'user' && data.inscripcion?.alumnosInscriptos?.find(a => a === alumno.id);
        });
      })

    }
    this.authService.obtenerUsuarioAutenticado().pipe(take(1)).subscribe(
      (usuario: Usuario | null) => {
        
        this.authUserRole = usuario;
        if(this.nrosAlumnoInscripto && this.authUserRole && this.nrosAlumnoInscripto.includes(this.authUserRole.studentId!)){
          this.estoyInscripto = true
        }

      }
    );
  }
  obtenerAlumnosInscriptos(alumnosInscriptos: number[]): void {
    
    const alumnos: any[] = [];
    for (const id of alumnosInscriptos) {
      this.alumnosService.getEstudiantePorId(id)
        .subscribe(estudiante => {
          
          // Agrega el objeto alumno a la lista
          alumnos.push({id: estudiante.id, nombre: estudiante.nombre, apellido: estudiante.apellido});
        });
    }
    this.alumnosInscriptos = alumnos;
  }

  eliminarCursoAlumno(id: number, alumno: Estudiante) {

      this.inscripcionesService.eliminarInscripcionDelAlumno(id, alumno.id!).subscribe(
        inscripcion => {

          this.alumnosInscriptos = this.alumnosInscriptos.filter(a => a.id !== alumno.id);
          this.alumnosNoInscriptos.push(alumno);
          this.estoyInscripto = false
        }
      );
  }

  agregarAlumno(alumno: Estudiante) {

    this.inscripcionesService.agregarInscripcionAlumno(this.idInscripcion, alumno).subscribe(
      inscripcion => {
        
        this.alumnosInscriptos.push(alumno);
        this.alumnosNoInscriptos = this.alumnosNoInscriptos.filter(a => a.id !== alumno.id) ;


    })
  }
  agregarEstudiante(usuario: Usuario) {
    this.alumnosService.getEstudiantePorId(usuario.id).subscribe(estudiante => {
      
      // Aquí puedes llamar a la función agregarInscripcionAlumno y pasar el estudiante como argumento
      this.inscripcionesService.agregarInscripcionAlumno(this.idInscripcion, estudiante).subscribe(
        inscripcion => {
          
          this.alumnosInscriptos.push(estudiante);
          this.alumnosNoInscriptos = this.alumnosNoInscriptos.filter(a => a.id !== estudiante.id);
        }
      );
    });
  }
  //TODO desuscribirme de un curso

}
