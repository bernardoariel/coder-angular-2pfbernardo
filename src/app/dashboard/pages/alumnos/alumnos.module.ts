import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlumnosRoutingModule } from './alumnos-routing.module';
import { AlumnoComponent } from './alumno/alumno.component';
import { ListadoComponent } from './listado/listado.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { PipesModule } from "../../../shared/pipes/pipes.module";
import { ReactiveFormsModule } from '@angular/forms';
import { DetalleComponent } from './detalle/detalle.component';
import { ConfirmComponent } from './confirm/confirm.component';


@NgModule({
    declarations: [
        AlumnoComponent,
        ListadoComponent,
        DetalleComponent,
        ConfirmComponent
    ],
    exports: [
        AlumnoComponent,
        ListadoComponent
    ],
    imports: [
        CommonModule,
        AlumnosRoutingModule,
        MaterialModule,
        PipesModule,
        ReactiveFormsModule
    ]
})
export class AlumnosModule { }
