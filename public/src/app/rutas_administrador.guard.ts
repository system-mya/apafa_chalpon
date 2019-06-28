import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Rutas_administrador implements CanActivate {
  constructor(private router:Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
   
      if (localStorage.getItem('id_perfil')=='AD'){
        return true;
      }else{
        this.router.navigate(['/principal']);
        return false;
      }
  }
}
