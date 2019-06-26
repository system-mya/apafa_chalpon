import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuariosComponent } from './usuarios.component';
import { AnhiosComponent } from './anhios.component';
import { GradoSeccionComponent } from './grado_seccion.component';
import { LibrosComponent } from './libros.component';

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
      },
      {
        path: 'libros',
        component: LibrosComponent,
        data: {
          title: 'Libros'
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
