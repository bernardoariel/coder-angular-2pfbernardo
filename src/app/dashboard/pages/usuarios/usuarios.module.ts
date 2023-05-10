import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuarioComponent } from './usuario/usuario.component';
import { ListadoComponent } from './listado/listado.component';
import { DetalleComponent } from './detalle/detalle.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UsuarioComponent,
    ListadoComponent,
    DetalleComponent,
    ConfirmComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    MaterialModule,
    PipesModule,
    ReactiveFormsModule
  ]
})
export class UsuariosModule { }
