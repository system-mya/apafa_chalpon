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
        redirectTo: 'lstpadron_matriculados'
      },
      {
        path: 'lstpadron_matriculados',
        component: ListaOficialApoderadosComponent,
        data: {
          title: 'Listar Padrón Matriculados'
        }
      },
      {
        path: 'ltsalumnos_xgrado',
        component: ListaMatriculadosComponent,
        data: {
          title: 'Listar Alumnos x Grado'
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
