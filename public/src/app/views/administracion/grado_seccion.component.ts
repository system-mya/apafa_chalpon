import { Component, OnInit, ViewChild,ViewEncapsulation } from '@angular/core';
import { GradoSeccionService } from './grado-seccion.service';
import { ToastrService } from 'ngx-toastr';
import { Grados } from '../../app.datos';
import {TooltipPosition} from '@angular/material';
import 'rxjs/add/operator/map';
@Component({
  templateUrl: 'grado_seccion.component.html',
  styleUrls: ['administracion.css'],
  encapsulation: ViewEncapsulation.None,
})
export class GradoSeccionComponent implements OnInit {
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  constructor(private _GradoServicios:GradoSeccionService,private toastr: ToastrService) {
    this.ListarGrados();
    
   }

  ngOnInit() {
    
    
  }

  DataGrado : Grados;
  ListarGrados (){
   this._GradoServicios.ListarGrados().subscribe(
     data => {
       if(data.status==1){
         this.DataGrado = data.data;
         console.log(this.DataGrado);
       }else{
         this.toastr.error("Consulta Sin Exito", 'Aviso!',{
           positionClass: 'toast-top-right'
         });
       }
       
     }
   )
 }
}
