
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CursoComponent } from './dashboard/pages/cursos/curso/curso.component';
import { AlumnosRoutingModule } from './dashboard/pages/alumnos/alumnos-routing.module';
import { HomeComponent } from './dashboard/pages/home/home.component';
import { AuthComponent } from './auth/auth.component';
import { AutGuard } from './auth/guards/aut.guard';
import { LoginGuard } from './auth/guards/login.guard';
import { AdminGuard } from './auth/guards/admin.guard';
import { LandingComponent } from './landing/landing.component';

const routes: Routes = [
  {
    path:'',
    redirectTo:'landing',
    pathMatch:'full'
  },
  {

    path:'dashboard',
    canActivate:[AutGuard],
    component: DashboardComponent,
    data: { breadcrumb: {alias: '/dashboard'} },
    children:[
      {
        path:'alumnos',
        loadChildren:()=>import('./dashboard/pages/alumnos/alumnos.module').then(m=>m.AlumnosModule)
      },
      {
        path:'cursos',
        loadChildren:()=>import('./dashboard/pages/cursos/cursos.module').then(m=>m.CursosModule)
      },
      {
        path:'inscripciones',
        loadChildren:()=>import('./dashboard/pages/inscripciones/inscripciones.module').then(m=>m.InscripcionesModule)
      },
      {
        path:'usuarios',
        loadChildren:()=>import('./dashboard/pages/usuarios/usuarios.module').then(m=>m.UsuariosModule)
      },
      {
        path:'',
        component:HomeComponent

      }
    ]
  },
  {
    path:'auth',
    canActivate:[LoginGuard],
    component:AuthComponent,
    loadChildren:()=>import('./auth/auth.module').then(m=>m.AuthModule)
  },
  {
    path:'landing',
    component:LandingComponent,
    loadChildren:()=>import('./landing/landing.module').then(m=>m.LandingModule)
  },
  {
    path:'**',
    redirectTo:'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
