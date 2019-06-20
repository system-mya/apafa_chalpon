import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresosComponent } from './ingresos.component';
import { ComprasComponent } from './compras.component';
import { ReunionesComponent } from './reuniones.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Tesoreria'
    },
    children: [
      {
        path: '',
        redirectTo: 'pagos'
      },
      {
        path: 'pagos',
        component: IngresosComponent,
        data: {
          title: 'Pagos'
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TesoreriaRoutingModule {}
