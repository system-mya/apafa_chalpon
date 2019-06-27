import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresosComponent } from './ingresos.component';
import { ComprasComponent } from './compras.component';
import { ReunionesComponent } from './reuniones.component';
import { ConceptosComponent } from './conceptos.component';

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
        path: 'compras',
        component: ComprasComponent,
        data: {
          title: 'Compras'
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
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TesoreriaRoutingModule {}
