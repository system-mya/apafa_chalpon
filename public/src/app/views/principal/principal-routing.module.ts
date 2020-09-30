import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicialComponent } from './inicial.component';
import { CuentaComponent } from './cuenta.component';
const routes: Routes = [
  {
    path: '',
    component: InicialComponent,
    data: {
      title: 'Inicio'
    }
  },
  {
    path: 'cuenta',
    component: CuentaComponent,
    data: {
      title: 'Cuenta'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipalRoutingModule {}
