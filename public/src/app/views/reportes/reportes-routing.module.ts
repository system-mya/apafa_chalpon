import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaOficialApoderadosComponent } from './lstoficial_apoderados.component';
import { FlagsComponent } from './flags.component';
import { FontAwesomeComponent } from './font-awesome.component';
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
        path: 'flags',
        component: FlagsComponent,
        data: {
          title: 'Flags'
        }
      },
      {
        path: 'font-awesome',
        component: FontAwesomeComponent,
        data: {
          title: 'Font Awesome'
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
