import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InscripcionesRoutingModule } from './inscripciones-routing.module';
import { InscripcionComponent } from './inscripcion/inscripcion.component';
import { ListadoComponent } from './listado/listado.component';
import { DetalleComponent } from './detalle/detalle.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ConfirmComponent } from './confirm/confirm.component';


@NgModule({
  declarations: [
    InscripcionComponent,
    ListadoComponent,
    DetalleComponent,
    ConfirmComponent
  ],
  imports: [
    CommonModule,
    InscripcionesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    PipesModule
  ],

})
export class InscripcionesModule { }
