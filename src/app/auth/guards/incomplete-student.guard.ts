import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, of, switchMap } from 'rxjs';
import { Estudiante } from 'src/app/core/interfaces/estudiante.interface';
import { AlumnoService } from 'src/app/core/services/alumno.service';
import { Usuario } from 'src/app/core/services/auth.service';
import { authState } from 'src/app/store/auth/auth.reducer';
import { selectAuthUser } from 'src/app/store/auth/auth.selectors';


@Injectable({
  providedIn: 'root'
})
export class IncompleteStudentGuard implements CanActivate {
 
   constructor(
    private store: Store<authState>,
    private alumnosService: AlumnoService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.store.select(selectAuthUser).pipe(
      switchMap((authUser: Usuario | null) => {
        if (authUser) {
          return this.alumnosService.getEstudiantePorId(authUser.id!);
        } else {
          // Si no hay un usuario autenticado, redirige a la página de inicio de sesión o a la ruta deseada
          return of(this.router.createUrlTree(['/login'])); // Usar 'of' para devolver un Observable
        }
      }),
      map((estudiante: Estudiante | UrlTree) => {
        if (estudiante instanceof UrlTree) {
          // Si se devuelve una UrlTree, redirige a la página correspondiente
          return estudiante;
        } else if (estudiante && estudiante.nombre === 'user' && estudiante.apellido === 'user') {
          // Si el estudiante tiene un nombre y apellido específico, redirige a la página de registro
          return this.router.createUrlTree(['auth', 'registro']);
        } else {
          // Si el estudiante cumple las condiciones, devuelve true para permitir la navegación
          return true;
        }
      })
    );
  }
  
}
