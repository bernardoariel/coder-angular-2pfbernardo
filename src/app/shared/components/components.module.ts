import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './confirm/confirm.component';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [
    ConfirmComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports:[
    ConfirmComponent
  ]
})
export class ComponentsModule { }
