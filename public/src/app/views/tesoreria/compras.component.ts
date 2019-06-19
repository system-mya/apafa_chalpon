import { Component,ViewChild,ViewEncapsulation } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {Compras,Detalle_Compra} from '../../app.datos';
import {MatPaginator, MatSort, MatTableDataSource, TooltipPosition} from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ComprasService } from './compras.service'
declare var swal: any;
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
  public detalle_compra : any = [];
  public btnagregar : boolean;
  constructor(private toastr: ToastrService,private loadingBar: LoadingBarService,
    private _CompraServicios: ComprasService) { 
    this.panel_tabla_compras=true;
  }

  

  btnNueva_Compra() {
    this.panel_registro=true;
    this.panel_tabla_compras=false;
    this.compra.ruc_compra='';
    this.compra.tipo_compra='';
    this.producto.nom_producto='';
    this.producto.medida='';
    this.producto.precio_unit=0;
    this.producto.cantidad=0;
    this.btnagregar=false;
  }

  btnagregar_producto(dato){
    var indice;
    this.compra.total_compra=0;
    if(dato.control.status=='VALID' && this.producto.nom_producto!='' && this.producto.medida!='' && this.producto.cantidad>0 && this.producto.precio_unit>0){
      this.detalle_compra.push({
        nom_producto : this.producto.nom_producto.toUpperCase(),
        cantidad : this.producto.cantidad,
        medida : this.producto.medida.toUpperCase(),
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

  Agregar_NvaCompra(form:Compras){
    console.log("this.detalle_compra.length");
    if(this.detalle_compra.length==0){
      this.toastr.success('No hay Detalle de la Compra', 'Aviso!',{positionClass: 'toast-top-right',timeOut: 500});
    }else{
      this.btnagregar=false;
      this.loadingBar.start();
      swal({
        title: '¿Esta seguro que desea guardar?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Guardar!',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.value == true) {
          form.anhio = localStorage.getItem('_anhio');
          form.id_usuario = localStorage.getItem('ID');
          form.detalle = this.detalle_compra;
          //form.contador=0;
          this._CompraServicios.nva_compra(form)
          .then(data => {
            if (data.status == 1) {
              swal({
                title: 'Aviso!',
                text: data.message,
                type: 'success',
                allowOutsideClick: false,
                allowEscapeKey:false
            }) 
            } else {
                swal({
                  title: 'Aviso!',
                  html:
                  '<span style="color:red">' +
                  data.message +
                  '</span>',
                  type: 'error',
                  allowOutsideClick: false,
                  allowEscapeKey: false
                });
            }
          } )
          .catch(err => console.log(err));
        }
      });
    }
  }

  btnElimianr_Producto(dato){
    this.toastr.success(dato, 'Aviso!',{positionClass: 'toast-top-right',timeOut: 500});
    this.detalle_compra.splice(dato, 1);
  }

  btnCancelar_Compra(opt){
      if(opt=='R'){
           this.panel_registro=false;
           this.panel_tabla_compras=true;

      }
  }


}



