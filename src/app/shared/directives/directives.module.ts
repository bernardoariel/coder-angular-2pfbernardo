import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormatoTituloDirective } from './formato-titulo.directive';


@NgModule({
  declarations: [
    FormatoTituloDirective
  ],
  imports: [
    CommonModule,
  ],
  exports:[
    FormatoTituloDirective
  ]
})
export class DirectivesModule { }
