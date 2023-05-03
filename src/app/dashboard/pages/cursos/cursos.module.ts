import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CursosRoutingModule } from './cursos-routing.module';
import { CursoComponent } from './curso/curso.component';
import { ListadoComponent } from './listado/listado.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DetalleComponent } from './detalle/detalle.component';
import { ConfirmComponent } from './confirm/confirm.component';


@NgModule({
  declarations: [

    CursoComponent,
    ListadoComponent,
    DetalleComponent,
    ConfirmComponent
  ],
  imports: [
    CommonModule,
    CursosRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    PipesModule
  ],
  exports:[
    CursoComponent,

  ]
})
export class CursosModule { }
