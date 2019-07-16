import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresosComponent } from './ingresos.component';
import { EgresosComponent } from './egresos.component';
import { ReunionesComponent } from './reuniones.component';
import { ConceptosComponent } from './conceptos.component';
import { Rutas_administrador } from '../../rutas_administrador.guard';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Tesoreria'
    },
    children: [
      {
        path: '',
        redirectTo: 'ingresos'
      },
      {
        path: 'ingresos',
        component: IngresosComponent,
        data: {
          title: 'Ingresos'
        }
      },
      {
        path: 'egresos',
        component: EgresosComponent,
        data: {
          title: 'Egresos'
        }
      },
      {
        path: 'reuniones',
        component: ReunionesComponent,
        data: {
          title: 'Reuniones'
        }
      },
      {
        path: 'conceptos',
        component: ConceptosComponent,
        data: {
          title: 'Conceptos'
        },
        canActivate:[Rutas_administrador]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TesoreriaRoutingModule {}
