import { Component, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import linkSidebar from './nav-items';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthService, Usuario } from '../core/services/auth.service';
import { TitleService } from '../core/services/title.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy{
  links = linkSidebar;
  authUser$:Observable<Usuario | null>;
  destroyed$ = new Subject<void>();
  title:string = 'Click Academy';
  titulo:string = '';
  breadcrumbs:Observable<string>;

 constructor(
  private router:Router,
  private authService:AuthService,
  private titleService: TitleService,
  private cd: ChangeDetectorRef,
  private activatedRoute:ActivatedRoute
 ) {
  this.authUser$ = this.authService.obtenerUsuarioAutenticado()
  this.breadcrumbs = this.titleService.obtenerBreadcrumbs();
  // console.log('this.breadcrumbs ::: ', this.breadcrumbs );
 }
  ngOnInit(): void {
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
  this.destroyed$.next();
  this.destroyed$.complete();
}
 logout(){
  // this.router.navigate(['auth','login'])
  this.authService.logout()
 }
}
