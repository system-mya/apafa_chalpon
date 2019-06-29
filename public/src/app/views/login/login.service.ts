import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Usuario } from '../../app.datos';
import "rxjs/add/operator/map";
import * as CryptoJS from 'crypto-js';
@Injectable()

export class LoginService {

  constructor(private _http:Http) { }
  
  //LLAMADO A LA API INICIAR SESION
  iniciar_sesion(user:Usuario){
    return this._http.post('/api/administracion/iniciar_sesion',user)
     .map(data => data.json()).toPromise()
 }

  getAlumnos(){
     return this._http.get('/api/users')
      .map(data => data.json()).toPromise()
  }

  //The set method is use for encrypt the value.
  set(keys, value){
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
    {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
  }

  //The get method is use for decrypt the value.
  get(keys, value){
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var decrypted = CryptoJS.AES.decrypt(value, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
