import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaOficialApoderadosComponent } from './lstoficial_apoderados.component';
import { ListaMatriculadosComponent } from './lstmatriculados.component';
import { BalanceComponent } from './lstbalance.component';
import { ListaIngresosEgresosComponent } from './lstingresosyegresos.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Reportes'
    },
    children: [
      {
        path: '',
        redirectTo: 'lstoficial_apoderados'
      },
      {
        path: 'lstoficial_apoderados',
        component: ListaOficialApoderadosComponent,
        data: {
          title: 'Listar Apoderados'
        }
      },
      {
        path: 'lstmatriculados',
        component: ListaMatriculadosComponent,
        data: {
          title: 'Listar Matriculados'
        }
      },
      {
        path: 'lstbalance',
        component: BalanceComponent,
        data: {
          title: 'Balance'
        }
      },
      {
        path: 'lstingresosyegresos',
        component: ListaIngresosEgresosComponent,
        data: {
          title: 'Ingresos y Egresos'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule {}
