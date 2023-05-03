import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService:AuthService,
  ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log('aaa')
      return this.authService.obtenerUsuarioAutenticado()
      .pipe(
        map((usuarioAutenticado)=>{
          console.log('usuarioAutenticado::: ', usuarioAutenticado);
          if(usuarioAutenticado && usuarioAutenticado.role!='admin'){
            alert('No tienes permiso')
            return false
          }else{
            return true
          }
        })
      )
  }

}
