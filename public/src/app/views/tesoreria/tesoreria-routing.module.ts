import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresosComponent } from './ingresos.component';
import { BadgesComponent } from './badges.component';
import { ModalsComponent } from './modals.component';

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
        path: 'badges',
        component: BadgesComponent,
        data: {
          title: 'Badges'
        }
      },
      {
        path: 'modals',
        component: ModalsComponent,
        data: {
          title: 'Modals'
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
