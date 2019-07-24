import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaOficialApoderadosComponent } from './lstoficial_apoderados.component';
import { ListaMatriculadosComponent } from './lstmatriculados.component';
import { BalanceComponent } from './lstbalance.component';
import { SimpleLineIconsComponent } from './simple-line-icons.component';

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
        path: 'simple-line-icons',
        component: SimpleLineIconsComponent,
        data: {
          title: 'Simple Line Icons'
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
