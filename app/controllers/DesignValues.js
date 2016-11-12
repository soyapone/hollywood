var express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
Article = mongoose.model('Article'),
xmlify = require('xmlify'),
funcion = require('../statics/DesignValues'),
tabla = require('../statics/tables'),
validationErrors = require('../statics/validationErrors'),
util = require('util'),
passport = require('passport');;

module.exports = function (app,mypassport) {
  app.use('/DesignValues', router);
  passport = mypassport;
};



// Operaciones serias
// Input: tipoMadera,servicio,duration,b,h,Ksys,gammaM
function validateAndGetValue(req,res){
  req.checkQuery('s', validationErrors.val_err_notEmpty()).notEmpty();
  req.checkQuery('s', validationErrors.val_err_isIn(tabla.findMaderaTypes())).isIn(tabla.findMaderaTypes());

  req.checkQuery('service', validationErrors.val_err_notEmpty()).notEmpty();

  req.checkQuery('LoadDuration', validationErrors.val_err_notEmpty()).notEmpty();
  req.checkQuery('LoadDuration', validationErrors.val_err_isIn(tabla.findServiceTypes())).isIn(tabla.findServiceTypes());

  req.checkQuery('b', validationErrors.val_err_notEmpty()).notEmpty();
  req.checkQuery('b', validationErrors.val_err_isFloat()).isFloat();

  req.checkQuery('h', validationErrors.val_err_notEmpty()).notEmpty();
  req.checkQuery('h', validationErrors.val_err_isFloat()).isFloat();

  req.checkQuery('Ksys', validationErrors.val_err_notEmpty()).notEmpty();
  req.checkQuery('Ksys', validationErrors.val_err_isIn(["false","true"])).isIn(["false","true"]);

  req.checkQuery('gammaM', validationErrors.val_err_notEmpty()).notEmpty();
  req.checkQuery('gammaM', validationErrors.val_err_isFloat()).isFloat();

  req.checkQuery('format', validationErrors.val_err_notEmpty()).notEmpty();
  req.checkQuery('format', validationErrors.val_err_isIn(["json","xml"])).isIn(["json","xml"]);



  errors = req.validationErrors();
  if (errors) {
    res.status(400).send('There have been validation errors: ' + util.inspect(errors));
    return;
  } else {

    var s = req.query.s;
    var service = Number(req.query.service);
    var LoadDuration = req.query.LoadDuration;
    var b = Number(req.query.b);
    var h = Number(req.query.h);
    var Ksys = ((req.query.Ksys === "true")||(req.query.Ksys === "True"));
    var gammaM = Number(req.query.gammaM);


    var logicalErrors = funcion.logicalValidation(s,service,LoadDuration,b,h,Ksys,gammaM);

    if (logicalErrors){
     res.status(400).send(logicalErrors);
     return;
    }

    var rawValues = funcion.DesignValues(s,service,LoadDuration,b,h,Ksys,gammaM);
    //console.log('rawValues', rawValues);

    var data = {
      'fmd' : rawValues.fmd.toFixed(2),
      'ft0d' : rawValues.ft0d.toFixed(2),
      'ft90d' : rawValues.ft90d.toFixed(2),
      'fc0d' : rawValues.fc0d.toFixed(2),
      'fc90d' : rawValues.fc90d.toFixed(2),
      'fvd' : rawValues.fvd.toFixed(2)
    };
    return data;
  }
}

//Para cálculos XML y JSON
//http://localhost:3705/DesignValues/?s=GL24h&service=1&LoadDuration=S&b=70&h=70&Ksys=true&gammaM=1.30&format=xml
router.get('/', function (req, res) {
 var result = validateAndGetValue(req,res);
 if (req.query.format == 'json'){
     if (result){
       res.json(result);
     }
 } else if(req.query.format == 'xml'){
   if (result){
     var msg = xmlify(result, { root: 'results' });
     res.set('Content-Type', 'text/xml');
     res.send(msg);
     res.end();
   }
 } else {
   res.send(result);
   res.set(400);
   res.end();
 };
});


// //Para cálculos del estilo http://localhost:3705/CompressionPerpendicularToTheGrain/GUI/
// router.get('/GUI', function (req, res) {
//   //console.log(tabla.findService());
//   res.render('CompressionPerpendicularToTheGrain', {
//     title: 'Compression Perpendicular to the Grain',
//     woodtypes: tabla.findMaderaTypes(),
//     services: tabla.findServiceTypes()
//   });
//   res.end();
// });