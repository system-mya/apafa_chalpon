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
  constructor() { 
    this.panel_tabla_compras=true;
  }

  

  btnNueva_Compra() {
    this.panel_registro=true;
    this.panel_tabla_compras=false;
    this.compra.tipo_compra='';
  }

  btnagregar_producto(){
    this.detalle_compra.push({
      nom_producto : this.producto.nom_producto,
      cantidad : this.producto.cantidad,
      medida : this.producto.medida,
      precio_unit : this.producto.precio_unit
    });
    this.producto = {};
  }


}



