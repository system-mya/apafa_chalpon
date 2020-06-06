import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { navTS,navAD,navSE } from '../../_nav';
import {Router} from '@angular/router';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit {
  public username:string;
  public anhio:number;
  public perfil:string;
  public anhio_lectivo:string;
  public navItems:any;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement= document.body;
  constructor(private router: Router,private location: Location,private spinner: NgxSpinnerService) {
  
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });
    this.element = document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });

    
  }

  ngOnInit() {
    this.anhio = new Date().getFullYear();
    this.spinner.show();
    this.username=localStorage.getItem('username');
    this.perfil=localStorage.getItem('perfil');
    this.anhio_lectivo=localStorage.getItem('_anhio');
    if(localStorage.getItem('id_perfil')=='AD'){
      this.navItems=navAD;
    }else{
      if(localStorage.getItem('id_perfil')=='TS'){
        this.navItems=navTS;
      }else{
        this.navItems=navSE;
      }      
    }
  }

  logout(){
    localStorage.removeItem('username');
    localStorage.removeItem('id_perfil');
    localStorage.removeItem('perfil');
    localStorage.removeItem('_anhio');
    this.router.navigate(['/login']);
  }
}
