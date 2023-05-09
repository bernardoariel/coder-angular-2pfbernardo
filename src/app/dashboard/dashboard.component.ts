import { Component, OnDestroy } from '@angular/core';
import linkSidebar from './nav-items';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthService, Usuario } from '../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy{
  links = linkSidebar;
  authUser$:Observable<Usuario | null>;
  destroyed$ = new Subject<void>();
  titulo:string = 'Click Academy';
 constructor(
  private router:Router,
  private authService:AuthService
 ) {
  this.authUser$ = this.authService.obtenerUsuarioAutenticado()
 }
 ngOnDestroy(): void {
  this.destroyed$.next();
  this.destroyed$.complete();
}
 logout(){
  // this.router.navigate(['auth','login'])
  this.authService.logout()
 }
}
