import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoComponent } from './listado/listado.component';

const routes: Routes = [
  {
    path:'',
    children:[
      {
        path:'listado',
        component:ListadoComponent,
        data: { breadcrumb: {alias: 'dashboard/CURSOS/listado'} },
      },
      {
        path:'**',
        redirectTo:'listado'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CursosRoutingModule { }
