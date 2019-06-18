import { Component,ViewChild,ViewEncapsulation } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {Compras,Detalle_Compra} from '../../app.datos';
import {MatPaginator, MatSort, MatTableDataSource, TooltipPosition} from '@angular/material';
@Component({
  templateUrl: 'compras.component.html',
  styleUrls: ['tesoreria.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ComprasComponent {
  @ViewChild('NvaCompraModal') public NvaCompraModal: ModalDirective;
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  public compra : Compras = {};
  public producto : Detalle_Compra = {};
  public panel_registro : boolean;
  public panel_tabla_compras : boolean;
  public detalle_compra = [];
  public btnagregar : boolean;
  constructor() { 
    this.panel_tabla_compras=true;
  }

  

  btnNueva_Compra() {
    this.panel_registro=true;
    this.panel_tabla_compras=false;
    this.compra.tipo_compra='';
    this.producto.nom_producto='';
    this.producto.medida='';
    this.producto.precio_unit=0;
    this.producto.cantidad=0;
  }

  btnagregar_producto(dato){
    var indice;
    this.compra.total_compra=0;
    if(dato.control.status=='VALID' && this.producto.nom_producto!='' && this.producto.medida!='' && this.producto.cantidad>0 && this.producto.precio_unit>0){
      this.detalle_compra.push({
        nom_producto : this.producto.nom_producto,
        cantidad : this.producto.cantidad,
        medida : this.producto.medida,
        precio_unit : this.producto.precio_unit
      });
      for(indice in this.detalle_compra){
        this.compra.total_compra=this.compra.total_compra + Number(this.detalle_compra[indice].precio_unit * this.detalle_compra[indice].cantidad);
         console.log(this.compra.total_compra);
      }
      this.producto.nom_producto='';
      this.producto.medida='';
      this.producto.precio_unit=0;
      this.producto.cantidad=0;
      this.btnagregar=false;
    }else{
      this.btnagregar=true;
    }
  }


}



