var tabla = require('./tables');
var _ = require ('lodash');

exports.valorDeCalculo = function(kmod, X, gammaM){
  return (kmod * X)/ gammaM;
}

exports.kc90 = function (l1,h,durmiente,tipoMadera){
  if (l1>= 2*h){
    if (durmiente){
      if(tabla.isConiferous(tipoMadera)){
        return 1.25;
      }
      if(tabla.isGL(tipoMadera)){
        return 1.5;
      }
    } else {
      if(tabla.isConiferous(tipoMadera)){
        return 1.50;
      }
      if(tabla.isGL(tipoMadera)){
        return 1.75;
      }
    }
  } else {
    return 1;
  }
  return 1;
}

//El ángulo va siempre en Radianes
exports.areaEf = function(b,l,l1,c1,c2,alfRadian){
  var cc1 = _.min([(30*Math.sin(alfRadian)),l, c1,l1/2]);
  var cc2 = _.min([(30*Math.sin(alfRadian)),l, c2,l1/2]);
  res = b * (l + cc1 + cc2);
  //console.log("b: ",b, "- l: ",l,"- l1: ",l1,"- c1: ",c1, "- c2: ",c2,"- alfRadian: ",alfRadian,"- cc1: ",cc1,"- cc2: ",cc2,"- res: ",res)
  return res;
}

exports.toRadian = function(alf){
   return alf * Math.PI / 180;
}

exports.Kcr = function(ID){
  if (tabla.isConiferous(ID) || tabla.isHardwood(ID) || tabla.isGL(ID) ) return 0.67;

  return  1;
}

// var prueba = valorDeCalculo(3,5,2);
//
// console.log("El resultado es: ",prueba);
