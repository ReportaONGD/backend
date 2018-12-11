const mongoose = require('mongoose');
const Documento = mongoose.model('Documento');
const fs = require('fs');
exports.findAll = function (req, res, next) {
  const proyecto = req.proyecto;
  let documentos = [];
  if (proyecto.objetivo) {
    if (proyecto.objetivo.indicadores) {
      proyecto.objetivo.indicadores.forEach((indicador) => {
        if(indicador.fuente_verificacion) {
          indicador.fuente_verificacion.forEach((fuente) => {
            if(fuente.documentos) {
              fuente.documentos.forEach((doc) => {
                documentos.push(doc);
              });
            }
          });
        }
      });
    }
    
  }
  if (proyecto.objetivos_especificos) {
    proyecto.objetivos_especificos.forEach((objetivo) => {
      if (objetivo.indicadores) {
        objetivo.indicadores.forEach((indicador) => {
          if ( indicador.fuente_verificacion) {
            indicador.fuente_verificacion.forEach((fuente) => {
              if (fuente.documentos) {
                fuente.documentos.forEach((doc) => {
                  documentos.push(doc);
                });
              }
            });
          }
        });
      }
    });
  }
  if(proyecto.gastos) {
    proyecto.gastos.forEach((gasto) => {
      if (gasto.documentos) {
        gasto.documentos.forEach((doc) => {
          documentos.push(doc);
        });
      }
    });
  }
  
  return res.json(documentos);
};

exports.download = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }
  const doc = new Documento(req.body);
  const ruta = doc.ruta + '/' + doc.nombre;
  //const ruta = 'C:\\Projects\\AECID-BACKEND\\uploads\\Demo\\Proyecto 1\\fuentes_verificacion\\' + doc.nombre;
  const file = fs.createReadStream(ruta);
  
  if(fs.existsSync(ruta)) {
    console.log('Existe');
  }
  var stat = fs.statSync(ruta);
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=' + doc.nombre);
  file.pipe(res);
};

