import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, pipe } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private authService:AuthService,
    private router: Router
  ){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.authService.verificarToken()

    return this.authService.obtenerUsuarioAutenticado()
    .pipe(
      map((usuarioAutenticado)=>{
        if(usuarioAutenticado){
          return this.router.createUrlTree(['dashboard'])
        }else{
          return true
        }
      })
    )

  }

}
