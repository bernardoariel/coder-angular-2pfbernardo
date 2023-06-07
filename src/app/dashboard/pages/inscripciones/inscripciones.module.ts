import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InscripcionesRoutingModule } from './inscripciones-routing.module';
import { InscripcionComponent } from './inscripcion/inscripcion.component';
import { ListadoComponent } from './listado/listado.component';
import { DetalleComponent } from './detalle/detalle.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';

import { ConfirmComponent } from './confirm/confirm.component';
import { EffectsModule } from '@ngrx/effects';
import { InscripcionesEffects } from './store/inscripciones.effects';
import { StoreModule } from '@ngrx/store';
import { inscripcionesFeature } from './store/inscripciones.reducer';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';



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
    PipesModule,
    StoreModule.forFeature(inscripcionesFeature),
    EffectsModule.forFeature([InscripcionesEffects]),
    DirectivesModule
  ],

})
export class InscripcionesModule { }
