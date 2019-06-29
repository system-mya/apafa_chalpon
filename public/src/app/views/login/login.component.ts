import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {LoginService } from './login.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router:Router,private toastr: ToastrService,private _userServices:LoginService){ }
  username ="";
  password="";
  ngOnInit(){
    
  }

  cargando:boolean=false;
  login(form:NgForm){
    this.cargando=true;
      setTimeout(()=>{
        this.cargando = false;
      },3000)
      console.log("Login funcionando");
      this._userServices.iniciar_sesion(form.value)
      .then(data => {
        if(data.status==1){
          this.toastr.success('Bienvenido ' + data.data[0].nom_usu, 'Aviso!');
          localStorage.setItem('username',data.data[0].nom_usu);
          localStorage.setItem('id_perfil',data.data[0].abrev_perfil);
          localStorage.setItem('perfil',data.data[0].nombre_perfil);
          if(data.data[0].anhio_lectivo!=null){
            localStorage.setItem('_anhio',data.data[0].anhio_lectivo);
          }else{
            localStorage.setItem('_anhio','SIN APERTURAR');
          }
          var encrypted = this._userServices.set('123456$#@$^@1ERF',data.data[0].idusuario);
          localStorage.setItem('ID',encrypted);
          var decrypted = this._userServices.get('123456$#@$^@1ERF', encrypted);
          this.router.navigate(['/principal']);
        }else{
          this.toastr.error(data.message, 'Aviso!');
          this.username ="";
          this.password="";
        }
      } )
      .catch(err => console.log(err))
    }
}
