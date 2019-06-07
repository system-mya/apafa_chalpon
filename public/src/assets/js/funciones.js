//NO SE PUEDE INGRESAR ESPACIOS EN BLANCOS AL PRINCIPIO
function verif(v){
if (v.value==" "){
   alert("No se pueden ingresar espacios al principio")
   v.value="";
  }
}

//SOLO NUMEROS
 function Num(e){
       var key;
     if(window.event){
        key = e.keyCode;
     }
     else if(e.wich){
       key = e.which;
     }
     if(key <48 || key > 57){
      return false;
     }
     return true;
    }

//SOLO LETRAS
function soloLetras(e){
       key = e.keyCode || e.which;
       tecla = String.fromCharCode(key).toLowerCase();
       letras = " áéíóúabcdefghijklmnñopqrstuvwxyz";
       especiales = "8-37-39-46";

       tecla_especial = false
       for(var i in especiales){
            if(key == especiales[i]){
                tecla_especial = true;
                break;
            }
        }

        if(letras.indexOf(tecla)==-1 && !tecla_especial){
            return false;
        }
    }

    function mayus(e) {
        e.value = e.value.toUpperCase();
    }