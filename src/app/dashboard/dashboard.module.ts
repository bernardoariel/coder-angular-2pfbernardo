import { MaterialModule } from './../shared/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { AlumnosModule } from './pages/alumnos/alumnos.module';
import { CursosModule } from './pages/cursos/cursos.module';
import { PipesModule } from '../shared/pipes/pipes.module';





@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    AlumnosModule,
    CursosModule,
    PipesModule
  ],
  exports:[
    DashboardComponent
  ]
})
export class DashboardModule { }
