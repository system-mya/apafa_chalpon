import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlumnosComponent } from './alumnos.component';
import { ApoderdoComponent } from './apoderado.component';
import { MatriculaComponent } from './matricula.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Apafa'
    },
    children: [
      {
        path: '',
        redirectTo: 'alumnos'
      },
      {
        path: 'alumnos',
        component: AlumnosComponent,
        data: {
          title: 'Alumnos'
        }
      },
      {
        path: 'apoderado',
        component: ApoderdoComponent,
        data: {
          title: 'Apoderados'
        }
      },
      {
        path: 'matricula',
        component: MatriculaComponent,
        data: {
          title: 'Matricula'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApafaRoutingModule {}
