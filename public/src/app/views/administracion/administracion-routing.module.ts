import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuariosComponent } from './usuarios.component';
import { AnhiosComponent } from './anhios.component';
import { GradoSeccionComponent } from './grado_seccion.component';
import { LibrosComponent } from './libros.component';
import { Rutas_administrador } from '../../rutas_administrador.guard';
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
        },
        canActivate:[Rutas_administrador]
      },
      {
        path: 'anhios',
        component: AnhiosComponent,
        data: {
          title: 'Años'
        },
        canActivate:[Rutas_administrador]
      },
      {
        path: 'grado_seccion',
        component: GradoSeccionComponent,
        data: {
          title: 'Grado y Secciones'
        },
        canActivate:[Rutas_administrador]
      },
      {
        path: 'libros',
        component: LibrosComponent,
        data: {
          title: 'Libros'
        },
        canActivate:[Rutas_administrador]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule {}
