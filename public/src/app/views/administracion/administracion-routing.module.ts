import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuariosComponent } from './usuarios.component';
import { AnhiosComponent } from './anhios.component';
import { GradoSeccionComponent } from './grado_seccion.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Administracion'
    },
    children: [
      {
        path: '',
        redirectTo: 'usuarios'
      },
      {
        path: 'usuarios',
        component: UsuariosComponent,
        data: {
          title: 'Usuarios'
        }
      },
      {
        path: 'anhios',
        component: AnhiosComponent,
        data: {
          title: 'Años'
        }
      },
      {
        path: 'grado_seccion',
        component: GradoSeccionComponent,
        data: {
          title: 'Grado y Secciones'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule {}
