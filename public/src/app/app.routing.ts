import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { LoginGuard } from './login.guard';
import { Rutas_administrador } from './rutas_administrador.guard';
import { NoLoginGuard } from './no-login.guard';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
    canActivate:[NoLoginGuard]
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    },
    canActivate:[NoLoginGuard]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'apafa',
        loadChildren: './views/apafa/apafa.module#ApafaModule',
        canActivate:[LoginGuard]
      },
      {
        path: 'administracion',
        loadChildren: './views/administracion/administracion.module#AdministracionModule',
        canActivate:[LoginGuard]
      },
      {
        path: 'principal',
        loadChildren: './views/principal/principal.module#PrincipalModule',
        canActivate:[LoginGuard]
      },
      {
        path: 'reportes',
        loadChildren: './views/reportes/reportes.module#ReportesModule',
        canActivate:[LoginGuard]
      },
      {
        path: 'tesoreria',
        loadChildren: './views/tesoreria/tesoreria.module#TesoreriaModule',
        canActivate:[LoginGuard]
      },
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
