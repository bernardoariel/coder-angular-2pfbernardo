import { Component, OnDestroy, ChangeDetectorRef, OnInit, Inject } from '@angular/core';
import linkSidebar from './nav-items';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, take } from 'rxjs';
import { AuthService, Usuario } from '../core/services/auth.service';
import { TitleService } from '../core/services/title.service';
import { Time, TimeService } from '../core/services/time.service';
import { DOCUMENT } from '@angular/common';





@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy{
  links = linkSidebar;
  authUser$:Observable<Usuario | null>;
  authUserRole!:Usuario | null;
  destroyed$ = new Subject<void>();
  title:string = 'Click Academy';
  titulo:string = '';
  breadcrumbs:Observable<string>;
  horaActual$: Observable<Time | null>;
  iconoGirado: boolean = true;

 isLigthModeActive = true;

 constructor(
  private router:Router,
  private authService:AuthService,
  private titleService: TitleService,
  private cd: ChangeDetectorRef,
  private activatedRoute:ActivatedRoute,
  private timeService:TimeService,
  @Inject(DOCUMENT) private document: Document,
 ) {
  this.authUser$ = this.authService.obtenerUsuarioAutenticado()
 
  this.breadcrumbs = this.titleService.obtenerBreadcrumbs();
  this.authService.obtenerUsuarioAutenticado().pipe(take(1)).subscribe(
    (usuario: Usuario | null) => {
      this.authUserRole = usuario;
    
    }
  );
    this.horaActual$ = this.timeService.reloj$;
 }
  ngOnInit(): void {
    setTimeout(() => {
      this.activatedRoute.data.subscribe(data => {
        this.titulo = data['breadcrumb'].alias;
  
        this.titleService.setTitle(this.titulo);
      });

      this.cd.detectChanges();
    }, 0);
  }
 ngOnDestroy(): void {
  this.destroyed$.next();
  this.destroyed$.complete();
}
  logout(){
    this.authService.logout()
  }
  toggleIcono() {
    this.iconoGirado = !this.iconoGirado;

  }
   onChangeTheme(): void {
    this.isLigthModeActive = !this.isLigthModeActive;
    console.log('this.isLigthModeActive::: ', this.isLigthModeActive);
    this.cambiarTheme(this.isLigthModeActive);
  }
  cambiarTheme(tema: boolean) {
    if (!tema) {
      this.document.body.classList.add('dark-mode');
      this.document.body.classList.remove('ligth-mode');
    } else {
      this.document.body.classList.add('ligth-mode');
      this.document.body.classList.remove('dark-mode');
    }
    console.log('tema::: ', tema);
  }
}
