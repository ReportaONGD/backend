const Excel = require('exceljs');
const mongoose = require('mongoose');
const Proyecto = mongoose.model('Proyecto');
const Informe = mongoose.model('Informe');
const moment = require('moment');
const _ = require('underscore');
const ExcelConfig = require('../../models/excel_config/excel_config');
const fs = require('fs');
const async = require('async');
// const wb = XLSX.readFile('./controllers/proyecto/plantilla_gong.xlsx', { cellStyles: true, });
// wb.SheetNames.forEach((wSheet) => {
//   const wsname = wSheet;
//   const sheet = wb.Sheets[wsname];
//   const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
//   setSheet(wsname, proyecto, sheet);
// });
// // XLSX.writeFile(wb, 'out.xlsx');
// const wbout = XLSX.write(this.wb, { type: 'array', bookType: 'xlsx', bookSST: true });
// saveAs(
//   new Blob([wbout],
//     { type: 'application/octet-stream' }
//   ), 'test1.xlsx');
exports.post = function (req, res, next) {
  const wb = new Excel.Workbook();
  let subvencion = 0;
  let final = false;
  let intermedio = 1;
  let fecha_inicio_proyecto = "";
  let fecha_fin_proyecto = "";
  let dias_proyecto = "";
  if (!req.body) {
    return res.sendStatus(404);
  };
  // TODO:DESCOMENTAR LINEA INFERIOR
  const proyecto_id = req.body.proyecto;
  //const informe = req.body;
  // TODO:ELIMINAR LINEA INFERIOR
  // const proyecto_id = '5b3c6511b37f1a4a78eb67ee';
  //TODO: Creo que seria necesario meter una propiedad al modelo de informe de tipo boolean que diga si es final o no
  //if (req.body.final)
    //final = true;
  Proyecto.findOne({
    empresa: req.current_user.empresa,
    _id: proyecto_id
  }).sort({
    createdAt: -1
  })
  .then(function (proyecto) {
    if (!proyecto) {
      return res.sendStatus(404);
    }

    //intermedio = proyecto.informes.filter(i => i.final != true);

    wb.xlsx.readFile('./assets/excel_templates/plantilla_gong.xlsx').then(function () {
      const imgId = wb.addImage({
        buffer: fs.readFileSync('./assets/img/aecid.png'),
        extension: 'png'
      });
      intermedio = proyecto.informes.filter(i => i.final != true);
      const informes = proyecto.informes;

      console.log('ha leido el excel')
      async.eachSeries(informes, function (informe, callback) {
        final = false;;
        if (!informe.proyecto_padre_id) {
          return res.sendStatus(404);
        }
        Proyecto.findOne({
          _id: informe.proyecto_padre_id.id
        }).then(function (proyecto) {
          const index = informes.indexOf(informe);
          let contSheet = 0;
          if (informe.final)
            final = true;
          console.log('ha encontrador el proyecto')
          wb.eachSheet(function (worksheet, sheetId) {
            //TODO: Cambiar el valor de true por el de la variable final
            console.log('cada hoja')
            contSheet += 1;
            setSheet(worksheet.name, proyecto, worksheet, subvencion, final, intermedio, informe, imgId, index);
            if ((index == (informes.length - 1)) && (contSheet == wb.model.sheets.length)) {
              const name = req.body.nombre + '_' + moment(new Date()).format('DDMMYYYY') + '.xlsx';
              console.log('pregunta si existe carpeta')
              if (!fs.existsSync('./uploads/excel_exports/' + req.body.periodo.nombre)) {
                console.log('intenta crear carpeta mkdirSync')
                fs.mkdirSync('./uploads/excel_exports/' + req.body.periodo.nombre);
                console.log('creo la carpeta')
              }
              console.log('escribe el archivo')
              wb.xlsx.writeFile('./uploads/excel_exports/' + req.body.periodo.nombre + '/' + name);
              // TODO: DESCOMENTAR CUANDO SE TERMINE, ES LA DEVOLUCION DEL FICHERO
              const file = fs.createReadStream('./uploads/excel_exports/' + req.body.periodo.nombre + '/' + name);

              if (fs.existsSync('./uploads/excel_exports/' + req.body.periodo.nombre + '/' + name)) {
                console.log('Existe');
              }
              // let stat = fs.statSync('./uploads/excel_exports/' + req.body.periodo.nombre + '/' + name);
              // res.setHeader('Content-Length', stat.size);
              // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
              // res.setHeader('Content-Disposition', 'attachment; filename=' + name);
              // file.pipe(res);
              res.attachment(name);
              wb.xlsx.write(res)
                .then(function () {
                  res.end()
                });
            }
          });
          callback();
        });
      }, function (err) {

        
        if (err) 
          console.log("error: " + err);
      });
    });
  }).catch(next);
}

function setSheet(wsname, project, sheet, subvencion, final, intermedio, informe, imgId, index) {
  if (wsname.indexOf('Datos Generales') > -1) {
    setDatosGenerales(sheet, project, wsname, subvencion, final, intermedio, index, informe);
  } else if (wsname.indexOf('Cronograma') > -1) {
    setCronograma(sheet, project);
  } else if (wsname.indexOf('Matriz') > -1) {
    setMatrizPlanificacion(sheet, project, imgId);
  } else if (wsname.indexOf('presup') > -1) {
    setPresupuestos(sheet, project, final, intermedio, index, imgId);
  } else if (wsname.indexOf('Incidencias') > -1) {
    setIncidencias(sheet, informe, final, intermedio, index, imgId);
  } else if (wsname.indexOf('Valoración general') > -1) {
    setValoracionGeneral(sheet, informe, final, intermedio, index, imgId);
  } else if (wsname.indexOf('financiero') > -1) {
    setResumenFinanciero(sheet, project, informe, final, intermedio, index, imgId);
  } else if (wsname.indexOf('Introducc') > -1) {
    addImage(sheet, imgId, 'B1:B1');
  }
  if (final) {
    if (wsname.indexOf('personal') > -1) {
      setPersonal(sheet, project, imgId);
    } else if (wsname.indexOf('Descripción') > -1) {
      setDescripcionDetallada(sheet, project, imgId);
    } else if (wsname.indexOf('criterios') > -1) {
      setValoracionCriterios(sheet, informe, imgId);
    } else if (wsname.indexOf('Transferencias') > -1) {
      setTransferenciasCambios(sheet, project, imgId);
    } else if (wsname.indexOf('tesorería') > -1) {
      setEstadoTesoreria(sheet, project, imgId);
    } else if (wsname.indexOf('final') > -1) {
      setEntregaFinal(sheet, informe, imgId);
    } else if (wsname.indexOf('Bienes') > -1) {
      setBienes(sheet, project, imgId);
    } else if (wsname.indexOf('comprobantes') > -1) {
      setDocumentos(sheet, project, imgId);
    }
  }
}

function setResumenFinanciero(sheet, project, informe, final, intermedio, index, imgId) {
  addImage(sheet, imgId, 'A1:A1');
  const presupuestos = project.presupuestos;
  const gastos = project.gastos;

  let pre_importe_aecid = 0;
  let pre_importe_ongd = 0;
  let pre_importe_publico = 0;
  let pre_importe_privado = 0;
  let pre_importe_ongd_locales = 0;
  let pre_importe_publico_locales = 0;
  let pre_importe_privado_locales = 0;

  if (presupuestos.length > 0) {
    presupuestos.forEach(presupuesto => {
      if ((presupuesto.pais.valor.toLowerCase()).indexOf('spain') > -1) {
        if (presupuesto.financiador && (presupuesto.financiador.nombre.toLowerCase()).indexOf('aecid') > -1) {
          pre_importe_aecid += presupuesto.importe;
        } else if (presupuesto.financiador && (presupuesto.financiador.nombre.toLowerCase()).indexOf('ong_int') > -1) {
          pre_importe_ongd += presupuesto.importe;
        } else {
          if (presupuesto.financiador && presupuesto.financiador.publico) {
            pre_importe_publico += presupuesto.importe;
          } else {
            pre_importe_privado += presupuesto.importe;
          }
        }
      } else {
        if (presupuesto.financiador && (presupuesto.financiador.nombre.toLowerCase()).indexOf('ong_int') > -1) {
          pre_importe_ongd_locales += presupuesto.importe;
        } else {
          if (presupuesto.financiador && presupuesto.financiador.publico) {
            pre_importe_publico_locales += presupuesto.importe;
          } else {
            pre_importe_privado_locales += presupuesto.importe;
          }
        }
      }
    });
  }

  sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.subvencion_aecid).value = pre_importe_aecid;
  sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.ongd_espanola).value = pre_importe_ongd;
  sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.aportaciones_publicas).value = pre_importe_publico;
  sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.aportaciones_privadas).value = pre_importe_privado;
  sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.ongd_local).value = pre_importe_ongd_locales;
  sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.aportaciones_publicas_local).value = pre_importe_publico_locales;
  sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.aportaciones_privadas_local).value = pre_importe_privado_locales;

  let gas_importe_aecid = 0;
  let gas_importe_ongd = 0;
  let gas_importe_publico = 0;
  let gas_importe_privado = 0;
  let gas_importe_ongd_locales = 0;
  let gas_importe_publico_locales = 0;
  let gas_importe_privado_locales = 0;

  if (gastos && gastos.length > 0) {
    gastos.forEach(gasto => {
      if ((gasto.financiador.pais.valor.toLowerCase()).indexOf('spain') > -1) {
        if (gasto.financiador && (gasto.financiador.nombre.toLowerCase()).indexOf('aecid') > -1) {
          gas_importe_aecid += gasto.importe_local;
        } else if (gasto.financiador && (gasto.financiador.nombre.toLowerCase()).indexOf('ong_int') > -1) {
          gas_importe_ongd += gasto.importe_local;
        } else {
          if (gasto.financiador && gasto.financiador.publico) {
            gas_importe_publico += gasto.importe_local;
          } else {
            gas_importe_privado += gasto.importe_local;
          }
        }
      } else {
        if (gasto.financiador && (gasto.financiador.nombre.toLowerCase()).indexOf('ong_int') > -1) {
          gas_importe_ongd_locales += gasto.importe_local;
        } else {
          if (gasto.financiador && gasto.financiador.publico) {
            gas_importe_publico_locales += gasto.importe_local;
          } else {
            gas_importe_privado_locales += gasto.importe_local;
          }
        }
      }
    });
  }

  if (final) {
    sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.final.subvencion_aecid).value = gas_importe_aecid;
    sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.final.ongd_espanola).value = gas_importe_ongd;
    sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.final.aportaciones_publicas).value = gas_importe_publico;
    sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.final.aportaciones_privadas).value = gas_importe_privado;
    sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.final.ongd_local).value = gas_importe_ongd_locales;
    sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.final.aportaciones_publicas_local).value = gas_importe_publico_locales;
    sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.final.aportaciones_privadas_local).value = gas_importe_privado_locales;
  } else if (intermedio.length > 1 && index != 0) {
    sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.informe_2.subvencion_aecid).value = gas_importe_aecid;
    sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.informe_2.ongd_espanola).value = gas_importe_ongd;
    sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.informe_2.aportaciones_publicas).value = gas_importe_publico;
    sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.informe_2.aportaciones_privadas).value = gas_importe_privado;
    sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.informe_2.ongd_local).value = gas_importe_ongd_locales;
    sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.informe_2.aportaciones_publicas_local).value = gas_importe_publico_locales;
    sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.informe_2.aportaciones_privadas_local).value = gas_importe_privado_locales;
  } else {
    sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.informe_1.subvencion_aecid).value = gas_importe_aecid;
    sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.informe_1.ongd_espanola).value = gas_importe_ongd;
    sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.informe_1.aportaciones_publicas).value = gas_importe_publico;
    sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.informe_1.aportaciones_privadas).value = gas_importe_privado;
    sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.informe_1.ongd_local).value = gas_importe_ongd_locales;
    sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.informe_1.aportaciones_publicas_local).value = gas_importe_publico_locales;
    sheet.getCell(ExcelConfig.ExcelConfig.RESUMEN_FINANCIERO.informe_1.aportaciones_privadas_local).value = gas_importe_privado_locales;

  }
}

function setEntregaFinal(sheet, informe, imgId) {
  addImage(sheet, imgId, 'A2:A2');
  Object.keys(ExcelConfig.ExcelConfig.ENTREGA_FINAL).forEach((key) => {
    const cell = ExcelConfig.ExcelConfig.ENTREGA_FINAL[key];
    sheet.getCell(cell).value = informe[key] ? informe[key] : '';
  });
}

function setValoracionCriterios(sheet, informe, imgId) {
  addImage(sheet, imgId, 'A2:A2');
  Object.keys(ExcelConfig.ExcelConfig.VALORACION_CRITERIOS).forEach((key) => {
    const cell = ExcelConfig.ExcelConfig.VALORACION_CRITERIOS[key];
    sheet.getCell(cell).value = informe[key] ? informe[key] : '';
  });
}

function setIncidencias(sheet, informe, final, intermedio, index, imgId) {
  addImage(sheet, imgId, 'A1:A1');
  if (final) {
    Object.keys(ExcelConfig.ExcelConfig.INCIDENCIAS.final).forEach((key) => {
      const start_column = ExcelConfig.ExcelConfig.INCIDENCIAS.final[key].start;
      const end_column = ExcelConfig.ExcelConfig.INCIDENCIAS.final[key].end;
      if (informe[key] && informe[key].length > 0) {
        setDataIncidencias(informe[key], start_column, end_column, sheet);
      }
    });
  } else {
    if (intermedio.length > 1 && index != 0) {
      Object.keys(ExcelConfig.ExcelConfig.INCIDENCIAS.informe_2).forEach((key) => {
        const start_column = ExcelConfig.ExcelConfig.INCIDENCIAS.informe_2[key].start;
        const end_column = ExcelConfig.ExcelConfig.INCIDENCIAS.informe_2[key].end;
        if (informe[key] && informe[key].length > 0) {
          setDataIncidencias(informe[key], start_column, end_column, sheet);
        }
      });
    } else {
      Object.keys(ExcelConfig.ExcelConfig.INCIDENCIAS.informe_1).forEach((key) => {
        const start_column = ExcelConfig.ExcelConfig.INCIDENCIAS.informe_1[key].start;
        const end_column = ExcelConfig.ExcelConfig.INCIDENCIAS.informe_1[key].end;
        if (informe[key] && informe[key].length > 0) {
          setDataIncidencias(informe[key], start_column, end_column, sheet);
        }
      });
    }
  }
}

function setTransferenciasCambios(sheet, project, imgId) {
  addImage(sheet, imgId, 'A1:A1');
  const transferenciasEuros = project.operaciones_bancarias.filter(op => op.tipo_movimiento.valor.toLowerCase().indexOf('transferencia') > -1 && op.cuenta_origen.moneda.codigo.toLowerCase().indexOf('eur') > -1);
  const transferenciasNoEuros = project.operaciones_bancarias.filter(op => op.tipo_movimiento.valor.toLowerCase().indexOf('transferencia') > -1 && op.cuenta_origen.moneda.codigo.toLowerCase().indexOf('eur') == -1);

  let bydate = _.groupBy(transferenciasEuros, 'fecha');

  let byfinanciador = _.map(bydate, function (array) {
    return _.groupBy(array, 'financiador')
  });

  let start = ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_fondos.start;
  let column_number = start;
  byfinanciador.forEach(fechas => {

    const op = Object.keys(fechas).map(it => fechas[it])

    if (!sheet.getCell(ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_fondos.fecha + column_number)) {
      sheet.addCellToSheet(ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_fondos.fecha + column_number, op[0][0].fecha);
    } else {
      sheet.getCell(ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_fondos.fecha + column_number).value = op[0][0].fecha;
    }


    let rowInitDate = column_number;
    op.forEach(financiador => {
      
      const cell = ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_fondos.financiador;
      // if (!sheet.getCell(cell.split('-')[0] + column_number).isMerged) {
      //   sheet.mergeCells(cell.split('-')[0] + column_number, cell.split('-')[1] + column_number);
      // }

      if (!sheet.getCell(cell.split('-')[0] + column_number)) {
        sheet.addCellToSheet(cell.split('-')[0] + column_number, financiador[0].financiador.nombre);
      } else {
        sheet.getCell(cell.split('-')[0] + column_number).value = financiador[0].financiador.nombre;
      }
      // if (!sheet.getCell(cell.split('-')[0] + column_number).isMerged)
      //   sheet.mergeCells(cell.split('-')[0] + column_number , cell.split('-')[1] + column_number - 1);
      financiador.forEach(op => {
        const column_euros_transferidos = ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_fondos.euros_transferidos + column_number.toString();
        const column_euros_recibidos = ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_fondos.euros_recibidos + column_number.toString();
        const column_tasa_cambio = ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_fondos.tasa_cambio_euros + column_number.toString();
        
        if (!sheet.getCell(column_euros_transferidos)) {
          sheet.addCellToSheet(column_euros_transferidos, op.importe);
        } else {
          sheet.getCell(column_euros_transferidos).value = op.importe;
        }
        // setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_fondos.euros_transferidos, column_number, column_euros_transferidos);
        if (!sheet.getCell(column_euros_recibidos)) {
          sheet.addCellToSheet(column_euros_recibidos, op.importe_enviado);
        } else {
          sheet.getCell(column_euros_recibidos).value = op.importe_enviado;
        }
        // setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_fondos.euros_recibidos, column_number, column_euros_recibidos);
        if (!sheet.getCell(column_tasa_cambio)) {
          sheet.addCellToSheet(column_tasa_cambio, (op.importe_enviado / op.importe).toString() + "%");
        } else {
          sheet.getCell(column_tasa_cambio).value = (op.importe_enviado / op.importe).toString() + "%";
        }
        // setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_fondos.tasa_cambio_euros, column_number, column_tasa_cambio);
        
        //sheet.spliceRows(column_number+1, column_number);
        
        column_number++;
      });
      const col1 = ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_fondos.financiador.split('-')[0] + rowInitDate;
      const col2 = ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_fondos.financiador.split('-')[1] + (column_number - 1);
      if (!sheet.getCell(col1).isMerged)
        sheet.mergeCells(col1, col2);

      sheet.getCell(col1).alignment = { vertical: 'middle', horizontal: 'center' };
    });

    const col1 = ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_fondos.fecha + rowInitDate;
    const col2 = ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_fondos.fecha + (column_number - 1);
    if (!sheet.getCell(col1).isMerged)
      sheet.mergeCells(col1 , col2 );

    sheet.getCell(col1).alignment = { vertical: 'middle', horizontal: 'center' };
  });

  bydate = _.groupBy(transferenciasNoEuros, 'fecha');

  byfinanciador = _.map(bydate, function (array) {
    return _.groupBy(array, 'financiador')
  });

  start = ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_cambiario.start;
  column_number = start;
  byfinanciador.forEach(fechas => {

    const op = Object.keys(fechas).map(it => fechas[it])

    if (!sheet.getCell(ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_cambiario.fecha + column_number)) {
      sheet.addCellToSheet(ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_cambiario.fecha + column_number, op[0][0].fecha);
    } else {
      sheet.getCell(ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_cambiario.fecha + column_number).value = op[0][0].fecha;
    }

    rowInitDate = column_number;
    op.forEach(financiador => {

      const cell = ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_cambiario.financiador;
      // if (!sheet.getCell(cell.split('-')[0] + column_number).isMerged) {
      //   sheet.mergeCells(cell.split('-')[0] + column_number, cell.split('-')[1] + column_number);
      // }

      if (!sheet.getCell(cell + column_number)) {
        sheet.addCellToSheet(cell + column_number, financiador[0].financiador.nombre);
      } else {
        sheet.getCell(cell + column_number).value = financiador[0].financiador.nombre;
      }
      // if (!sheet.getCell(cell.split('-')[0] + column_number).isMerged)
      //   sheet.mergeCells(cell.split('-')[0] + column_number , cell.split('-')[1] + column_number - 1);

      financiador.forEach(op => {
        const column_euros_transferidos = ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_cambiario.euros_transferidos + column_number.toString();
        const column_euros_recibidos = ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_cambiario.euros_recibidos + column_number.toString();
        const column_tasa_cambio = ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_cambiario.tasa_cambio_local + column_number.toString();

        if (!sheet.getCell(column_euros_transferidos)) {
          sheet.addCellToSheet(column_euros_transferidos, op.importe);
        } else {
          sheet.getCell(column_euros_transferidos).value = op.importe;
        }
        // setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_cambiario.euros_transferidos, column_number, column_euros_transferidos);
        if (!sheet.getCell(column_euros_recibidos)) {
          sheet.addCellToSheet(column_euros_recibidos, op.importe_enviado);
        } else {
          sheet.getCell(column_euros_recibidos).value = op.importe_enviado;
        }
        // setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_cambiario.euros_recibidos, column_number, column_euros_recibidos);
        if (!sheet.getCell(column_tasa_cambio)) {
          sheet.addCellToSheet(column_tasa_cambio, (op.importe_enviado / op.importe).toString() + "%");
        } else {
          sheet.getCell(column_tasa_cambio).value = (op.importe_enviado / op.importe).toString() + "%";
        }
        // setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_cambiario.tasa_cambio_euros, column_number, column_tasa_cambio);

        //sheet.spliceRows(column_number+1, column_number);

        column_number++;
      });

      const col1 = ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_cambiario.financiador + rowInitDate;
      const col2 = ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_cambiario.financiador + (column_number - 1);
      if (!sheet.getCell(col1).isMerged)
        sheet.mergeCells(col1, col2);

      sheet.getCell(col1).alignment = { vertical: 'middle', horizontal: 'center' };
    });
    const col1 = ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_cambiario.fecha + rowInitDate;
    const col2 = ExcelConfig.ExcelConfig.TRANSFERENCIAS_CAMBIOS.total_cambiario.fecha + (column_number - 1);
    if (!sheet.getCell(col1).isMerged)
      sheet.mergeCells(col1, col2);

    sheet.getCell(col1).alignment = { vertical: 'middle', horizontal: 'center' };
  });


}

function setEstadoTesoreria(sheet, project, imgId){
  addImage(sheet, imgId, 'A1:A1');
  const cuentasEspana = project.cuentas_bancarias.filter(c => c.pais.valor.toLowerCase().indexOf('spain') > -1);
  const cuentasExterior = project.cuentas_bancarias.filter(c => c.pais.valor.toLowerCase().indexOf('spain') == -1);

  if (cuentasEspana.length > 0) {
    const start = ExcelConfig.ExcelConfig.ESTADO_TESORERIA.cuentas.cuentas_bancarias_espana.start;
    const column = ExcelConfig.ExcelConfig.ESTADO_TESORERIA.cuentas.column;
    sheet.getCell(column + start).value = cuentasEspana[0].entidad;
    sheet.getCell(column + (start+1)).value = cuentasEspana[0].ncuenta;
    sheet.getCell(column + (start+2)).value = cuentasEspana[0].moneda.codigo;

    if (cuentasEspana.length > 1) {
      sheet.getCell(column + (start + 3)).value = cuentasEspana[1].entidad;
      sheet.getCell(column + (start + 4)).value = cuentasEspana[1].ncuenta;
      sheet.getCell(column + (start + 5)).value = cuentasEspana[1].moneda.codigo;
    }
  }
  if (cuentasExterior.length > 0) {
    const start = ExcelConfig.ExcelConfig.ESTADO_TESORERIA.cuentas.cuentas_bancarias_exterior.start;
    const column = ExcelConfig.ExcelConfig.ESTADO_TESORERIA.cuentas.column;
    sheet.getCell(column + start).value = cuentasExterior[0].pais.valor;
    sheet.getCell(column + (start + 1)).value = cuentasExterior[0].entidad;
    sheet.getCell(column + (start + 2)).value = cuentasExterior[0].ncuenta;
    sheet.getCell(column + (start + 3)).value = cuentasExterior[0].moneda.codigo;
    if (cuentasExterior.length > 1) {
      sheet.getCell(column + (start + 4)).value = cuentasExterior[1].pais.valor;
      sheet.getCell(column + (start + 5)).value = cuentasExterior[1].entidad;
      sheet.getCell(column + (start + 6)).value = cuentasExterior[1].ncuenta;
      sheet.getCell(column + (start + 7)).value = cuentasExterior[1].moneda.codigo;
    }
  }

  Object.keys(ExcelConfig.ExcelConfig.ESTADO_TESORERIA.ingresos_transferencias).forEach((key) => {
    
    if (key != "start") {
      const start = ExcelConfig.ExcelConfig.ESTADO_TESORERIA.ingresos_transferencias.start;
      if (cuentasEspana.length > 0) {
        if (key === "E1")
          rellenarIngresos(key, cuentasEspana[0],start);

        if (cuentasEspana.length > 1 && key === "E2")
          rellenarIngresos(key, cuentasEspana[1], start);
      }
      if (cuentasExterior.length > 0) {

        if (key === "PD1")
          rellenarIngresos(key, cuentasExterior[0], start);

        if (cuentasExterior.length > 1 && key === "PD2")
          rellenarIngresos(key, cuentasExterior[1], start);
      }
    }

  });

  function rellenarIngresos(key, item, start) {
    
    let cell = ExcelConfig.ExcelConfig.ESTADO_TESORERIA.ingresos_transferencias[key];

    if (key == "E1") {
      const subvencion_aecid = project.operaciones_bancarias.filter(op => op.tipo_movimiento.valor.toLowerCase().indexOf('subvención') > -1 && op.financiador.nombre.toLowerCase().indexOf('aecid') > -1 && op.cuenta_destino.ncuenta == item.ncuenta);
      let totalSubvencion = 0;
      subvencion_aecid.forEach(op => {
        totalSubvencion += op.importe_enviado;
      });
      sheet.getCell(cell + start).value = totalSubvencion;
    }

    const aportaciones_otros = project.operaciones_bancarias.filter(op => (op.tipo_movimiento.valor.toLowerCase().indexOf('ingreso') > -1 || op.tipo_movimiento.valor.toLowerCase().indexOf('transferencia') > -1) && op.financiador.nombre.toLowerCase().indexOf('aecid') == -1 && op.cuenta_destino.ncuenta == item.ncuenta);
    let totalAportaciones = 0;
    aportaciones_otros.forEach(op => {
      totalAportaciones += op.importe_enviado;
    });
    sheet.getCell(cell + (start + 1)).value = totalAportaciones;

    const remesas_enviadas = project.operaciones_bancarias.filter(op => (op.tipo_movimiento.valor.toLowerCase().indexOf('ingreso') > -1 || op.tipo_movimiento.valor.toLowerCase().indexOf('transferencia') > -1) && op.financiador.nombre.toLowerCase().indexOf('aecid') == -1 && op.cuenta_origen.ncuenta == item.ncuenta);
    let totalRemesasEnviadas = 0;
    remesas_enviadas.forEach(op => {
      totalRemesasEnviadas += op.importe_enviado;
    });
    sheet.getCell(cell + (start + 2)).value = totalRemesasEnviadas;


    sheet.getCell(cell + (start + 3)).value = totalAportaciones;
    
    let totalGastosEfectuados = 0;
    if (project.gastos && project.gastos.length > 0) {

      project.gastos.forEach(gasto => {
        const pagos = gasto.pagos.filter(pago => pago.cuenta_origen.ncuenta === item.ncuenta);

        pagos.forEach(pago => {
          totalGastosEfectuados += pago.importe_enviado
        });
      });
    }
    
    sheet.getCell(cell + (start + 6)).value = totalGastosEfectuados;

    const reintegros_efectuados = project.operaciones_bancarias.filter(op => op.tipo_movimiento.valor.toLowerCase().indexOf('reintegro') > -1 && op.financiador.nombre.toLowerCase().indexOf('aecid') == -1 && op.cuenta_origen.ncuenta == item.ncuenta);
    let totalReintegros = 0;
    reintegros_efectuados.forEach(op => {
      totalReintegros += op.importe_enviado;
    });
    sheet.getCell(cell + (start + 7)).value = totalReintegros;

  }

}


function setValoracionGeneral(sheet, informe, final, intermedio, index, imgId) {
  addImage(sheet, imgId, 'A1:A1');
  if (final) {
    Object.keys(ExcelConfig.ExcelConfig.VALORACION_GENERAL.final).forEach((key) => {
      const cell = ExcelConfig.ExcelConfig.VALORACION_GENERAL.final[key];
      sheet.getCell(cell).value = informe[key] ? informe[key] : '';
    });
  } else {
    if (intermedio.length > 1 && index != 0) {
      Object.keys(ExcelConfig.ExcelConfig.VALORACION_GENERAL.informe_2).forEach((key) => {
        const cell = ExcelConfig.ExcelConfig.VALORACION_GENERAL.final[key];
        sheet.getCell(cell).value = informe[key] ? informe[key] : '';
      });
    } else {
      Object.keys(ExcelConfig.ExcelConfig.VALORACION_GENERAL.informe_1).forEach((key) => {
        const cell = ExcelConfig.ExcelConfig.VALORACION_GENERAL.final[key];
        sheet.getCell(cell).value = informe[key] ? informe[key] : '';
      });
    }
  }
}

function setDataIncidencias(list, start_column, end_column, sheet) {
  const column = ExcelConfig.ExcelConfig.INCIDENCIAS.final.modificaciones_sustanciales.column;
  for (let i = 0; i <= list.length && start_column <= end_column; i++) {
    sheet.getCell(column + start_column).value = list[i];
    start_column++;
  }
}
// function setStyleParagraph(sheet, start_cell, title) {
//   let cell = sheet.getCell('A' + start_cell);
//   cell.style = Object.create(cell.style);
//   cell.style.bgColor = 'FFFF99';
//   celltoChange.border = sheet.getCell('A9').border;
//   celltoChange.font = sheet.getCell('A9').font;
//   cell.value = title;
// }
// function setDefaultCells(sheet) {
//   const initCell = ExcelConfig.ExcelConfig.INCIDENCIAS.informe_2.modificaciones_sustanciales.column +  ExcelConfig.ExcelConfig.INCIDENCIAS.informe_2.modificaciones_sustanciales.start;
//   const from = ExcelConfig.ExcelConfig.INCIDENCIAS.informe_2.modificaciones_sustanciales.start;
//   const to = ExcelConfig.ExcelConfig.INCIDENCIAS.informe_2.modificaciones_sustanciales.start + 3;
//   let cell = sheet.getCell('A' + from);
//   cell.style = Object.create(cell.style);
//   cell.style.bgColor = '99CC00';
//   celltoChange.border = sheet.getCell('A9').border;
//   celltoChange.font = sheet.getCell('A9').font;
//   cell.value =  ExcelConfig.ExcelConfig.INCIDENCIAS.informe_2.texto;
//   sheet.mergeCells('A' + from, 'A' + to);
//   for (let i = from; i <= to; i++) {
//     const add_cell = ExcelConfig.ExcelConfig.INCIDENCIAS.informe_2.modificaciones_sustanciales.column + i;
//     sheet.getCell(add_cell).value = '';
//     sheet.getCell(add_cell).style.border =  sheet.getCell('A' + from).border;
//   }
// }
function setDatosGenerales(sheet, project, wsname, subvencion, final, intermedio, index, informe) {
  Object.keys(ExcelConfig.ExcelConfig.DESCRIPCION).forEach((key) => {
    if (key !== 'final' && key !== 'informe_1' && key !== 'informe_2') {
      let col = ExcelConfig.ExcelConfig.DESCRIPCION[key];
      if (typeof col === 'object') {
        col = col.column + col.start;
      }
      if (col.indexOf('-') === -1) {
        if (sheet.getCell(col)) {
          // sheet[col].s = {
          //   patternType: 'solid',
          //   fgColor: { rgb: 'red' },
          //   bgColor: { green: 'green' }
          // };
          if (key === 'auditoria') {
            sheet.getCell(col).value = project[key] === false ? 'no' : 'si';
          } else if (key === 'entidad') {
            const financiadores = project.financiador.filter(f => f.nombre.toLowerCase().indexOf('aecid') == -1)
            let entidades = "";
            for (let index = 0; index < financiadores.length; index++) {
              const element = financiadores[index];
              if (index != 0)
                entidades += ",";
              entidades += element.nombre;
            }
            sheet.getCell(col).value = entidades;
          } else if (key === 'fecha_inicio') {
            const objetivos = project.objetivos_especificos;
            let fechas_inicio = new Array();
            let fechas_fin = new Array();
            objetivos.forEach(element => {
              const resultados = element.resultados;
              resultados.forEach(element => {
                const actividades = element.actividades;
                actividades.forEach(element => {
                  fechas_inicio.push(moment(element.ejecucion_actividad.fecha_inicio,'DD/MM/YYYY'));
                  fechas_fin.push(moment(element.ejecucion_actividad.fecha_fin,'DD/MM/YYYY'));
                });
              });
            });
            fecha_inicio_proyecto = moment.max(fechas_inicio);
            fecha_fin_proyecto = moment.max(fechas_fin);
            const fecha = fecha_inicio_proyecto.format('DD/MM/YYYY');
            sheet.getCell(col).value = fecha;
          } else if (key === 'duracion') {
            dias_proyecto = moment(fecha_fin_proyecto).diff(moment(fecha_inicio_proyecto), 'days', true);
            sheet.getCell(col).value = dias_proyecto + " días";
          } else if (key === 'fecha_fin') {
            const fecha = fecha_fin_proyecto.format('DD/MM/YYYY');
            sheet.getCell(col).value = fecha;
          } else if (key === 'pais') {
            let paises = '';
            project.pais.forEach((p) => {
              paises += p.valor + ', ';
            });
            paises = paises.substr(0, paises.length - 2);
            sheet.getCell(col).value = paises;
          } else if (key === 'socio_local') {
            sheet.getCell(col).value = project.gestor.nombre;
          } else if (key === 'aportacion_ong') {
            let aportaciones_ong = project.presupuestos.filter(p => p.financiador.nombre.toLowerCase().indexOf("ong") > -1);
            const conste = 0;
            aportaciones_ong.forEach(element => {
              conste += element.importe;
            });
            sheet.getCell(col).value = conste;
          } else if (key === 'coste_total') {
            let coste_total = 0;
            project.presupuestos.forEach(element => {
              coste_total += element.importe;
            });
            sheet.getCell(col).value = coste_total;
          } else if (key === 'modificaciones') {
            const column_name = 'B';
            let column_number = 35;
            project.modificaciones.forEach((m) => {
              const column = column_name + column_number.toString();
              sheet.getCell(column).value = m.descripcion + ', ' + moment(new Date(m.fecha)).format('DD/MM/YYYY');
              column_number++;
            });
          } else if (key === 'aportacion_financiador') {
            // project.cuentas_bancarias.forEach((cb) => {
            // const result = project.operaciones_bancarias.filter(ob => ob.tipo_movimiento.valor.indexOf('Subvencion') > -1);
            const result = project.operaciones_bancarias.filter(ob => ob.financiador.nombre.toLowerCase().indexOf('aecid') > -1);
            
            if (result && result.length > 0) {
              for (let index = 0; index < result.length; index++) {
                subvencion += result[index].importe;
              }
            }
            //});
            sheet.getCell(col).value = subvencion;
          } else if (key === 'subvencion_ejecutada') {
            let gastos = 0;
            // project.cuentas_bancarias.forEach((cb) => {
            const result = project.operaciones_bancarias.filter((ob) => {
              if (!ob.tipo_movimiento.es_entrada) {
                gastos += ob.importe;
              }
            });
            // });
            sheet.getCell(col).value = subvencion - gastos;
          } else {
            sheet.getCell(col).value = project[key];
          }
        }
      } else {
        if (key === 'aportacion') {
          const column_name_nombre = 'B';
          const column_name_cuantia = 'C';
          let initColumn_number = 20; 
          let column_number = 20; 
          let presupByfinanciador = project.presupuestos.filter(p => p.financiador.nombre.toLowerCase().indexOf('aecid') == -1);
          presupByfinanciador = _.groupBy(presupByfinanciador, 'financiador');
          presupByfinanciador = _.map(presupByfinanciador);
          for (let i = 0; i < presupByfinanciador.length; i++) {
            const pre = presupByfinanciador[i];
            let total = 0;
            if (pre.length > 0) {
              for (let index = 0; index < pre.length; index++) {
                const element = pre[index];
                total += element.importe;
              }
              const column_financiador = column_name_nombre + initColumn_number.toString();
              const column_cuantia = column_name_cuantia + column_number.toString();
              if (!sheet.getCell(column_cuantia)) {
                sheet.addCellToSheet(column_cuantia, total);
              } else {
                sheet.getCell(column_cuantia).value = total;
              }
              if (!sheet.getCell(column_financiador)) {
                sheet.addCellToSheet(column_financiador, pre[0].financiador.nombre);
              } else {
                sheet.getCell(column_financiador).value = pre[0].financiador.nombre;
              }
            }
          }
        }
      }
    }

  });
  if (final) {
    sheet.getCell(ExcelConfig.ExcelConfig.DESCRIPCION.final.fecha_cierre_periodo).value = moment(new Date(informe.periodo.fecha_fin)).format('DD/MM/YYYY');
    sheet.getCell(ExcelConfig.ExcelConfig.DESCRIPCION.final.fecha_elaboracion_informe).value = moment(new Date()).format('DD/MM/YYYY');
    sheet.getCell(ExcelConfig.ExcelConfig.DESCRIPCION.final.autor).value = informe.autor;
  } else {
    if (intermedio.length > 1 && index != 0) {
      sheet.getCell(ExcelConfig.ExcelConfig.DESCRIPCION.informe_2.fecha_cierre_periodo).value = moment(new Date(informe.periodo.fecha_fin)).format('DD/MM/YYYY');
      sheet.getCell(ExcelConfig.ExcelConfig.DESCRIPCION.informe_2.fecha_elaboracion_informe).value = moment(new Date()).format('DD/MM/YYYY');
      sheet.getCell(ExcelConfig.ExcelConfig.DESCRIPCION.informe_2.autor).value = informe.autor;
    } else {
      sheet.getCell(ExcelConfig.ExcelConfig.DESCRIPCION.informe_1.fecha_cierre_periodo).value = moment(new Date(informe.periodo.fecha_fin)).format('DD/MM/YYYY');
      sheet.getCell(ExcelConfig.ExcelConfig.DESCRIPCION.informe_1.fecha_elaboracion_informe).value = moment(new Date()).format('DD/MM/YYYY');
      sheet.getCell(ExcelConfig.ExcelConfig.DESCRIPCION.informe_1.autor).value = informe.autor;
    }
  }
}

function setDescripcionDetallada(sheet, project, imgId) {
  sheet.addImage(imgId, 'A2:A2')
  const cell = ExcelConfig.ExcelConfig.DESCRIPCION_DETALLADA.celda;
  sheet.getCell(cell).value = project.descripcion;
}

function setMatrizPlanificacion(sheet, project, imgId) {
  addImage(sheet, imgId, 'A1:A1');
  let totalRecursos = 0;
  Object.keys(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.DATOS_GENERALES).forEach((key) => {
    if (sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.DATOS_GENERALES[key])) {
      if (key === 'fecha_inicio') {
        sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.DATOS_GENERALES[key]).value = fecha_inicio_proyecto.format('DD/MM/YYYY');
      } else if (key === 'duracion') {
        sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.DATOS_GENERALES[key]).value = dias_proyecto;
      } else if (key === 'fecha_fin') {
        sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.DATOS_GENERALES[key]).value = fecha_fin_proyecto.format('DD/MM/YYYY');
      }else if (key === 'socio_local') {
        let socios = "";
        if (project.implementador.length > 0) {
          for (let i = 0; i < project.implementador.length; i++) {
            if (i > 0) {
              socios += ",";
            }
            socios += project.implementador[i].nombre;
            
          }
        }
        sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.DATOS_GENERALES[key]).value = socios;
      } else {
        sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.DATOS_GENERALES[key]).value = project[key];
      }
    }

  });
  const objetivo = project.objetivo;
  let start = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador.start;
  sheet.getColumn('A').style.font = {
    name: 'Arial Black',
    color: {
      argb: '000000'
    },
    family: 2,
    size: 10,
    italic: false
  };
  if (objetivo) {

    sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.descripcion + start).value = objetivo.codigo + ': ' + objetivo.descripcion;
    setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.descripcion, start, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.descripcion + start);
    if (objetivo.indicadores && objetivo.indicadores.length > 0) {
      objetivo.indicadores.forEach((i) => {
        Object.keys(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador).forEach((key) => {
          if (key !== 'start') {
            const cell = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador[key] + start
            if (key === 'fuente_verificacion') {
              if (i.fuente_verificacion && i.fuente_verificacion.length > 0) {
                let fvs = '';
                i.fuente_verificacion.forEach((fv) => {
                  fvs += fv.codigo + ': ' + fv.descripcion + '\r\n';
                });
                sheet.getCell(cell).value = fvs;
                setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador[key], start, cell);
              }
            } else if (key === 'comentarios') {
              let comentarios = '';
              if (i.comentarios && i.comentarios.length > 0) {
                i.comentarios.forEach((c) => {
                  comentarios += c.texto + '\r\n';
                });
                sheet.getCell(cell).value = comentarios;
                setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador[key], start, cell);
              } else {
                sheet.getCell(cell).value = ' ';
                setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador[key], start, cell);
              }
            } else if (key === 'blancos') {
              const cells = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador[key].split('-');
              cells.forEach(column => {
                const celda = column + start;
                sheet.getCell(celda).value = ' ';
                setBodyCellStyle(sheet, column, start, celda);
              });
            } else {
              sheet.getCell(cell).value = i[key];
              setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador[key], start, cell);

            }
          }
        });
        start++;
      });
    }
  }
  if (project.objetivos_especificos && project.objetivos_especificos.length > 0) {
    project.objetivos_especificos.forEach((oe) => {
      Object.keys(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_ESPECIFICO).forEach((key) => {
        const celda = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_ESPECIFICO[key].celda;
        const cell = celda + start;
        setHeaderCellStyle(sheet, celda, start, cell);
        sheet.getCell(cell).value = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_ESPECIFICO[key].texto;
      });
      start++;
      sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.descripcion + start).value = oe.codigo + ': ' + oe.descripcion;
      if (oe.indicadores && oe.indicadores.length > 0) {
        oe.indicadores.forEach((i) => {
          Object.keys(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador).forEach((key) => {
            if (key !== 'start') {
              const cell = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador[key] + start
              if (key === 'fuente_verificacion') {
                if (i.fuente_verificacion && i.fuente_verificacion.length > 0) {
                  let fvs = '';
                  i.fuente_verificacion.forEach((fv) => {
                    fvs += fv.codigo + ': ' + fv.descripcion + '\r\n';
                  });
                  sheet.getCell(cell).value = fvs;
                  setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador[key], start, cell);
                } else {
                  sheet.getCell(cell).value = ' ';
                  setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador[key], start, cell);
                }
              } else if (key === 'comentarios') {
                let comentarios = '';
                if (i.comentarios && i.comentarios.length > 0) {
                  i.comentarios.forEach((c) => {
                    comentarios += c.texto + '\r\n';
                  });
                  sheet.getCell(cell).value = comentarios;
                  setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador[key], start, cell);
                } else {
                  sheet.getCell(cell).value = ' ';
                  setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador[key], start, cell);
                }
              } else if (key === 'comentarios_ong') {
                const cell = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador[key];
                const celda = cell + start;
                if (i.comentarios_ong) {
                  sheet.getCell(celda).value = i.comentarios_ong;
                } else {
                  sheet.getCell(celda).value = '';
                }
                setBodyCellStyle(sheet, cell, start, celda);
              } else if (key === 'comentarios_aecid') {
                const cell = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador[key];
                const celda = cell + start;
                if (i.comentarios_aecid) {
                  sheet.getCell(celda).value = i.comentarios_aecid;
                } else {
                  sheet.getCell(celda).value = '';
                }
                setBodyCellStyle(sheet, cell, start, celda);
              } else if (key === 'descripcion') {
                if (!sheet.getCell(cell, 'C' + start).isMerged) {
                  sheet.mergeCells(cell, 'C' + start);
                }
                sheet.getCell(cell).value = i[key];
                setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador[key], start, cell);
                setBodyCellStyle(sheet, 'C', start, 'C' + start);
              } else {
                sheet.getCell(cell).value = i[key];
                setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador[key], start, cell);
              }
            }
          });
          start++;
        });
      }
      let cellToStyle = sheet.getCell('A' + start);
      cellToStyle.style = Object.create(cellToStyle.style);
      cellToStyle.font = sheet.getCell('A11').font;
      cellToStyle.border = sheet.getCell('A11').border;
      cellToStyle.fill = sheet.getCell('A11').fill;
      cellToStyle.value = 'Hipótesis';
      start++;
      if (oe.hipotesis && oe.hipotesis.length > 0) {
        oe.hipotesis.forEach(h => {
          sheet.getCell('A' + start).value = h.descripcion;
          setBodyCellStyle(sheet, 'A', start, 'A' + start);
          start++;
        });
      }
      if (oe.resultados && oe.resultados.length > 0) {
        oe.resultados.forEach((resultado) => {
          Object.keys(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.RESULTADO).forEach((key) => {
            const cell = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.RESULTADO[key].celda + start;
            const celda = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.RESULTADO[key].celda;
            setHeaderCellStyle(sheet, celda, start, cell);
            if (key === 'descripcion' || key === 'indicadores') {
              sheet.getCell(cell).value = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.RESULTADO[key].texto + ' ' + resultado.codigo;
            } else {
              sheet.getCell(cell).value = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.RESULTADO[key].texto;
            }
          });
          start++;
          sheet.getCell('A' + start).value = resultado.descripcion;
          setBodyCellStyle(sheet, 'A', start, 'A' + start);
          if (resultado.indicadores && resultado.indicadores.length > 0) {
            resultado.indicadores.forEach((i) => {
              Object.keys(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador).forEach((key) => {
                if (key !== 'start') {
                  const cell = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador[key] + start
                  if (key === 'fuente_verificacion') {
                    if (i.fuente_verificacion && i.fuente_verificacion.length > 0) {
                      let fvs = '';
                      i.fuente_verificacion.forEach((fv) => {
                        fvs += fv.codigo + ': ' + fv.descripcion + '\r\n';
                      });
                      sheet.getCell(cell).value = fvs;
                      setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador[key], start, cell);
                    } else {
                      sheet.getCell(cell).value = ' ';
                      setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador[key], start, cell);
                    }
                  } else if (key === 'comentarios') {
                    let comentarios = '';
                    if (i.comentarios && i.comentarios.length > 0) {
                      i.comentarios.forEach((c) => {
                        comentarios += c.texto + '\r\n';
                      });
                      sheet.getCell(cell).value = comentarios;
                      setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador[key], start, cell);
                    } else {
                      sheet.getCell(cell).value = ' ';
                      setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador[key], start, cell);
                    }
                  } else if (key === 'descripcion') {
                    if (!sheet.getCell(cell, 'C' + start).isMerged) {
                      sheet.mergeCells(cell, 'C' + start);
                    }
                    sheet.getCell(cell).value = i[key];
                    setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador[key], start, cell);
                    setBodyCellStyle(sheet, 'C', start, 'C' + start);
                  } else if (key === 'blancos') {
                    const cells = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador[key].split('-');
                    cells.forEach(column => {
                      const celda = column + start;
                      sheet.getCell(celda).value = ' ';
                      setBodyCellStyle(sheet, column, start, celda);
                    });
                  } else {
                    sheet.getCell(cell).value = i[key];
                    setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador[key], start, cell);
                  }
                }
              });
              start++;
            });
          }
          cellToStyle = sheet.getCell('A' + start);
          cellToStyle.style = Object.create(cellToStyle.style);
          cellToStyle.font = sheet.getCell('A11').font;
          cellToStyle.border = sheet.getCell('A11').border;
          cellToStyle.fill = sheet.getCell('A11').fill;
          cellToStyle.value = 'Hipótesis';
          start++;
          if (resultado.hipotesis && resultado.hipotesis.length > 0) {
            resultado.hipotesis.forEach(h => {
              sheet.getCell('A' + start).value = h.descripcion;
              start++;
            });
          }
          Object.keys(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDADES).forEach((key) => {
            if (key === 'recursos') {
              sheet.unMergeCells(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDADES[key].celda + start);
              setHeaderCellStyle(sheet, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDADES[key].celda, start, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDADES[key].celda + start);
              sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDADES[key].celda + start).value = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDADES[key].texto + ' ' + resultado.codigo;

            } else if (key === 'blancos') {
              const cells = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDADES[key].celda.split(',');
              cells.forEach(cell => {
                if (cell.split('-')[0] === 'K' || cell.split('-')[0] == 'L') {
                  setHeaderCellStyle(sheet, cell.split('-')[0], start, cell.split('-')[0] + start);
                } else {
                  setUnesedCellStyle(sheet, cell.split('-')[0], start, cell.split('-')[0] + start);
                }
                if (!sheet.getCell(cell.split('-')[0] + start).isMerged) {
                  sheet.mergeCells(cell.split('-')[0] + start, cell.split('-')[1] + start);
                }
                sheet.getCell(cell.split('-')[0] + start).value = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDADES[key].texto;
              });
            } else if (key === 'comentarios') {
              const cells = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDADES[key].celda.split('-');
              if (!sheet.getCell(cells[0] + start).isMerged) {
                sheet.mergeCells(cells[0] + start, cells[1] + start);
              }
              setHeaderCellStyle(sheet, cells[0], start, cells[0] + start);
              setHeaderCellStyle(sheet, cells[1], start, cells[1] + start);
              sheet.getCell(cells[0] + start).value = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDADES[key].texto;
            } else {
              const cell = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDADES[key].celda + start;
              const celda = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDADES[key].celda
              setHeaderCellStyle(sheet, celda, start, cell);
              sheet.getCell(cell).value = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDADES[key].texto;
            }

          });
          start++;
          if (resultado.actividades && resultado.actividades.length > 0) {
            let total = 0;
            resultado.actividades.forEach((a) => {
              Object.keys(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDAD).forEach((key) => {
                if (key === 'recursos') {
                  const presupuestos = project.presupuestos.filter((p) => {
                    return p.actividad.id === a.id;
                  });
                  if (presupuestos && presupuestos.length > 0) {
                    const totales = setPresupuestosActividad(presupuestos);
                    Object.keys(totales).forEach((key) => {
                      sheet.unMergeCells(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDAD.recursos.texto + start);
                      sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDAD.recursos.texto + start).value = key;
                      setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDAD.recursos.texto, start, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDAD.recursos.texto + start);

                      if (totales[key] && totales[key].length === 1) {
                        sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDAD.recursos.costes + start).value = totales[key][0].importe;
                        total += totales[key][0].importe
                      } else {
                        let coste = 0;
                        totales[key].forEach(c => {
                          coste += c.importe;
                        });
                        total += coste;
                        sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDAD.recursos.costes + start).value = coste;
                      }
                      setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDAD.recursos.costes, start, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDAD.recursos.costes + start);
                      start++;
                    });
                  } else {
                    sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDAD.recursos.costes + start).value = ' ';
                    setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDAD.recursos.costes, start, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDAD.recursos.costes + start);
                  }
                } else if (key === 'comentarios') {
                  let comentarios = '';
                  const cells = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDAD[key].split('-');
                  if (a.comentarios && a.comentarios.length > 0) {
                    a.comentarios.forEach(c => {
                      comentarios += c.texto + "\r\n";
                    });
                  }
                  if (!sheet.getCell(cells[0] + start).isMerged) {
                    sheet.mergeCells(cells[0] + start, cells[1] + start);
                  }
                  sheet.getCell(cells[0] + start).value = comentarios;
                  setBodyCellStyle(sheet, cells[0], start, cells[0] + start);
                  setBodyCellStyle(sheet, cells[0], start, cells[1] + start);
                } else if (key === 'blancos') {
                  const cells = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDAD[key].split(',');
                  cells.forEach(cell => {
                    if (!sheet.getCell(cell.split('-')[0] + start).isMerged) {
                      sheet.mergeCells(cell.split('-')[0] + start, cell.split('-')[1] + start);
                    }
                    cell.split('-').forEach(celda => {
                      setUnesedCellStyle(sheet, celda, start, celda + start);
                    });
                  });

                } else {
                  sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDAD[key] + start).value = a.codigo + ': ' + a.descripcion;
                  setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDAD[key], start, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDAD[key] + start);
                }
              });
              start++;
            });
            start++;
            const columnStartTotalRecurso = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDAD.recursos.totales.from;
            const columnEndTotalRecurso = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDAD.recursos.totales.to;
            const cellStartTotalRecurso = columnStartTotalRecurso + (start - 1);
            const cellEndTotalRecurso = columnEndTotalRecurso + (start - 1);
            const cellCosteTotalResultado = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDAD.recursos.totales.total + (start - 1);
            if (!sheet.getCell(cellStartTotalRecurso).isMerged) {
              sheet.mergeCells(cellStartTotalRecurso, cellEndTotalRecurso);
            }

            setBodyCellStyle(sheet, columnStartTotalRecurso, (start - 1), cellStartTotalRecurso);
            setBodyCellStyle(sheet, columnEndTotalRecurso, (start - 1), cellEndTotalRecurso);
            sheet.getCell(cellStartTotalRecurso).value = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDAD.recursos.totales.text + resultado.codigo;
            sheet.getCell(cellCosteTotalResultado).value = total;
            setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.ACTIVIDAD.recursos.totales.total, (start - 1), cellCosteTotalResultado);
            setUnesedCellStyle(sheet, 'D', (start - 1), 'D' + (start - 1));
            if (!sheet.getCell('D' + (start - 1)).isMerged)
              sheet.mergeCells('D' + (start - 1), 'L' + (start - 1));
            totalRecursos += total;
          }
        });
      }
    });
  }
  Object.keys(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.TOTALES).forEach(key => {
    if (key === "header") {
      const startColumn = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.TOTALES[key].from;
      const endColumn = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.TOTALES[key].to;
      setHeaderCellStyle(sheet, startColumn, start, startColumn + start);
      if (!sheet.getCell(startColumn + start).isMerged)
        sheet.mergeCells(startColumn + start, endColumn + start);
      sheet.getCell(startColumn + start).value = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.TOTALES[key].text;
      start++;
    } else {
      const columnStartTotalRecurso = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.TOTALES[key].from;
      const columnEndTotalRecurso = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.TOTALES[key].to;
      const cellStartTotalRecurso = columnStartTotalRecurso + (start);
      const cellEndTotalRecurso = columnEndTotalRecurso + (start);
      const cellCosteTotalResultado = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.TOTALES[key].total + (start);
      if (!sheet.getCell(cellStartTotalRecurso).isMerged)
        sheet.mergeCells(cellStartTotalRecurso, cellEndTotalRecurso);
      setBodyCellStyle(sheet, columnStartTotalRecurso, (start), cellStartTotalRecurso);
      setBodyCellStyle(sheet, columnEndTotalRecurso, (start), cellEndTotalRecurso);
      sheet.getCell(cellStartTotalRecurso).value = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.TOTALES[key].text;
      sheet.getCell(cellCosteTotalResultado).value = totalRecursos;
      setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.TOTALES[key].total, (start), cellCosteTotalResultado);
      setUnesedCellStyle(sheet, 'D', (start), 'D' + (start));
      if (!sheet.getCell('D' + (start)).isMerged) 
        sheet.mergeCells('D' + (start), 'L' + (start));
      start++;
    }
  });
  setHeaderCellStyle(sheet, 'A', start, 'A' + start);
  if (!sheet.getCell('A' + (start)).isMerged)
    sheet.mergeCells('A' + (start), 'L' + (start));
  start++;
  setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.CONDICIONES_PREVIAS.from, start, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.CONDICIONES_PREVIAS.from + start);
  if (!sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.CONDICIONES_PREVIAS.from + start).isMerged) 
    sheet.mergeCells(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.CONDICIONES_PREVIAS.from + start, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.CONDICIONES_PREVIAS.to + start);
  sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.CONDICIONES_PREVIAS.from + start).value = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.CONDICIONES_PREVIAS.text;
  start++;
  Object.keys(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.COMENTARIOS_ONGD).forEach(key => {
    if (key === 'blancos') {
      ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.COMENTARIOS_ONGD[key].split('-').forEach(element => {
        setBodyCellStyle(sheet, element, start, element + start);
      });
    } else {
      setBodyCellStyle(sheet, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.COMENTARIOS_ONGD[key].from, start, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.COMENTARIOS_ONGD[key].from + start);
      sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.COMENTARIOS_ONGD[key].from + start).fill = sheet.getCell('A13').fill;
      if (!sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.COMENTARIOS_ONGD[key].from + start).isMerged) 
        sheet.mergeCells(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.COMENTARIOS_ONGD[key].from + start, ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.COMENTARIOS_ONGD[key].to + start);
      sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.COMENTARIOS_ONGD[key].from + start).value = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.COMENTARIOS_ONGD[key].text;
    }
  });
}

function setPersonal(sheet, project, imgId) {
  addImage(sheet, imgId, 'A2:A2');
  let column_number = ExcelConfig.ExcelConfig.PERSONAS.start;
  for (let i = 0; i < project.personal.length; i++) {
    Object.keys(ExcelConfig.ExcelConfig.PERSONAS).forEach((key) => {
      if (key != "start" && key != "end") {
        const cell = ExcelConfig.ExcelConfig.PERSONAS[key] + column_number;
        if (key === 'categoria' || key === 'contrato' || key === 'tipo_personal') {
          sheet.getCell(cell).value = project.personal[i][key].valor;
        } else {
          sheet.getCell(cell).value = project.personal[i][key];
        }

      }
    });
    column_number++;
  }
}

function setCronograma(sheet, project) {
  const cronograma = {};
  cell_start = 10;
  project.objetivos_especificos.forEach((oe) => {
    oe.resultados.forEach((r) => {
      if (cell_start !== 10) {
        cell_start++;
      }
      if (r.actividades.length > 0) {
        cronograma['A' + cell_start] = r.descripcion;
        r.actividades.forEach((a) => {
          // cronograma['A' + cell_start] = a.codigo + ' perido previsto';
          if (a.ejecucion_actividad) {
            cell_start++;
            // cronograma['A' + cell_start] = a.codigo + ' perido real';
            setDates(cronograma, true, a, 'A', cell_start);
          } else {
            setDates(cronograma, false, a, 'A', cell_start);
          }
          cell_start++;
        });
      }

    });
    if (cell_start !== 10) {
      cell_start++;
    }
  });
  Object.keys(cronograma).forEach((key) => {
    sheet.add
    if (cronograma[key] instanceof Object) {
      Object.keys(cronograma[key]).forEach((key1) => {
        sheet.getCell(key).value = cronograma[key][key1].texto;
        // sheet.addCellToSheet(key , cronograma[key].texto);
        for (let i = 1; i <= cronograma[key][key1].mes_fin; i++) {
          const cell = ExcelConfig.ExcelConfig.CRONOGRAMA.meses[i] + cronograma[key][key1].num_celda;
          // sheet.addCellToSheet(cell , 'X');
          sheet.getCell(cell).value = 'X';
        }
      });
    } else {
      // sheet.addCellToSheet(key , cronograma[key]);
      sheet.getCell(key).value = cronograma[key];
    }
  });
}

function setDocumentos(sheet, project, imgId) {
  addImage(sheet, imgId, 'A3:A3');
  let start = ExcelConfig.ExcelConfig.DOCUMENTOS.start;
  project.gastos.forEach((g) => {
    Object.keys(ExcelConfig.ExcelConfig.DOCUMENTOS).forEach((key) => {
      let cell = ExcelConfig.ExcelConfig.DOCUMENTOS[key] + start;
      if (key !== 'start') {
        if (key === 'partida') {
          sheet.getCell(cell).value = g[key].codigo + ' ' + g[key].nombre;
        } else if (key === 'moneda') {
          sheet.getCell(cell).value = g[key].codigo;
        } else if (key === 'financiador') {
          if (g[key].nombre.toLowerCase().indexOf('aecid') > -1) {
            cell = ExcelConfig.ExcelConfig.DOCUMENTOS.financiador.aecid + start;
          } else if (g[key].nombre.toLowerCase().indexOf('otros') > -1) {
            cell = ExcelConfig.ExcelConfig.DOCUMENTOS.financiador.otros + start;
          } else {
            cell = ExcelConfig.ExcelConfig.DOCUMENTOS.financiador.fondos_propios + start;
          }
          sheet.getCell(cell).value = 'X';
        } else if (key === 'euros') {
        } else if (key === 'fecha') {
          sheet.getCell(cell).value = moment(g[key]).format('DD/MM/YYYY');
        } else {
          sheet.getCell(cell).value = g[key];
        }
      }
    });
    start++;
  });
}

function setPresupuestos(sheet, project, final, intermedio, index, imgId) {
  addImage(sheet, imgId, 'A1:A2');
  project.presupuestos.forEach(p => {
    Object.keys(ExcelConfig.ExcelConfig.PRESUPUESTOS.totales).forEach(key => {
      if (p.partida.codigo === key) {
        if (p.financiador.nombre.toLowerCase().indexOf('aecid') > -1) {
          sheet.getCell(ExcelConfig.ExcelConfig.PRESUPUESTOS.totales[key].aecid).value = p.importe;
        } else {
          sheet.getCell(ExcelConfig.ExcelConfig.PRESUPUESTOS.totales[key].otro).value = p.importe;
        }
      }
    })
  });
  if (final) {
    project.gastos.forEach(p => {
      Object.keys(ExcelConfig.ExcelConfig.PRESUPUESTOS.final).forEach(key => {
        if (p.partida.codigo === key) {
          if (p.financiador.nombre.toLowerCase().indexOf('aecid') > -1) {
            sheet.getCell(ExcelConfig.ExcelConfig.PRESUPUESTOS.final[key].aecid).value = p.importe_local;
          } else {
            sheet.getCell(ExcelConfig.ExcelConfig.PRESUPUESTOS.final[key].otro).value = p.importe_local;
          }
        }
      })
    });
  } else {
    if (intermedio.length > 1 && index != 0) {
      project.gastos.forEach(p => {
        Object.keys(ExcelConfig.ExcelConfig.PRESUPUESTOS.informe_2).forEach(key => {
          if (p.partida.codigo === key) {
            if (p.financiador.nombre.toLowerCase().indexOf('aecid') > -1) {
              sheet.getCell(ExcelConfig.ExcelConfig.PRESUPUESTOS.informe_2[key].aecid).value = p.importe_local;
            } else {
              sheet.getCell(ExcelConfig.ExcelConfig.PRESUPUESTOS.informe_2[key].otro).value = p.importe_local;
            }
          }
        })
      });
    } else {
      project.gastos.forEach(p => {
        Object.keys(ExcelConfig.ExcelConfig.PRESUPUESTOS.informe_1).forEach(key => {
          if (p.partida.codigo === key) {
            if (p.financiador.nombre.toLowerCase().indexOf('aecid') > -1) {
              sheet.getCell(ExcelConfig.ExcelConfig.PRESUPUESTOS.informe_1[key].aecid).value = p.importe_local;
            } else {
              sheet.getCell(ExcelConfig.ExcelConfig.PRESUPUESTOS.informe_1[key].otro).value = p.importe_local;
            }
          }
        })
      });
    }
  }
}

function setBienes(sheet, project, imgId) {
  addImage(sheet, imgId, 'A2:A2');
  const gastos = project.gastos.filter((gasto) => {
    return gasto.partida.costes.valor.toLowerCase().indexOf('inversión') > -1;
  })
  let start = ExcelConfig.ExcelConfig.BIENES.start;
  gastos.forEach(p => {
    sheet.getCell(ExcelConfig.ExcelConfig.BIENES["emisor"] + start).value = p.emisor;
    sheet.getCell(ExcelConfig.ExcelConfig.BIENES["concepto"] + start).value = p.concepto;
    sheet.getCell(ExcelConfig.ExcelConfig.BIENES["fecha"] + start).value = p.fecha;
    sheet.getCell(ExcelConfig.ExcelConfig.BIENES["cantidad"] + start).value = 1;
    sheet.getCell(ExcelConfig.ExcelConfig.BIENES["importe_local"] + start).value = p.importe_local;
    /* Object.keys(ExcelConfig.ExcelConfig.BIENES).forEach(key => {
      if (key != "start") {
        if (ExcelConfig.ExcelConfig.BIENES[key]) {
          const cell = ExcelConfig.ExcelConfig.BIENES[key] + start
          sheet.getCell(cell).value = p;
        }
      }
    }); */
    start++;
  });
}

function setDates(cronograma, exists_real, a, celda, num_celda) {
  if (!exists_real) {
    const fecha_inicio = moment(a.planificacion_actividad.fecha_inicio, 'DD/MM/YYYY', true)._d;
    const fecha_fin = moment(a.planificacion_actividad.fecha_fin, 'DD/MM/YYYY', true)._d;
    const mes_inicio = parseInt(moment(a.planificacion_actividad.fecha_inicio, 'DD/MM/YYYY', true).format('MM'));
    const mes_fin = parseInt(moment(a.planificacion_actividad.fecha_fin, 'DD/MM/YYYY', true).format('MM'));
    const date_diff_months = moment(fecha_fin).diff(moment(fecha_inicio), 'months', true);
    cronograma[celda + num_celda] = {
      previsto: {
        meses: date_diff_months,
        mes_inicio: mes_inicio,
        mes_fin: mes_inicio + date_diff_months,
        texto: a.codigo + ' periodo previsto'
      }
    };
  } else {
    const fecha_inicio_planificacion = moment(a.planificacion_actividad.fecha_inicio, 'DD/MM/YYYY', true)._d;
    const fecha_fin_planificacion = moment(a.planificacion_actividad.fecha_fin, 'DD/MM/YYYY', true)._d;
    const mes_inicio_planificacion = parseInt(moment(a.planificacion_actividad.fecha_inicio, 'DD/MM/YYYY', true).format('MM'));
    const date_diff_months_planificacion = moment(fecha_fin_planificacion).diff(moment(fecha_inicio_planificacion), 'months', false);

    const fecha_inicio_ejecucion = moment(a.ejecucion_actividad.fecha_inicio, 'DD/MM/YYYY', true)._d;
    const fecha_fin_ejecucion = moment(a.ejecucion_actividad.fecha_fin, 'DD/MM/YYYY', true)._d;
    const mes_inicio_ejecucion = parseInt(moment(a.ejecucion_actividad.fecha_inicio, 'DD/MM/YYYY', true).format('MM'));
    const date_diff_months_ejecucion = moment(fecha_fin_ejecucion).diff(moment(fecha_inicio_ejecucion), 'months', false);

    cronograma[celda + num_celda] = {
      previsto: {
        meses: date_diff_months_planificacion,
        mes_inicio: mes_inicio_planificacion,
        mes_fin: mes_inicio_planificacion + date_diff_months_planificacion,
        texto: a.codigo + ' periodo previsto',
        num_celda: num_celda
      },
    };
    cronograma[celda + (num_celda + 1)] = {
      real: {
        meses: date_diff_months_ejecucion,
        mes_inicio: mes_inicio_ejecucion,
        mes_fin: mes_inicio_ejecucion + date_diff_months_ejecucion,
        texto: a.codigo + ' periodo real',
        num_celda: num_celda + 1
      }
    };
  }

}

function setPresupuestosActividad(presupuestos) {
  const totals = {};
  presupuestos.forEach((pre) => {
    totals[`${pre.partida.nombre}`] = totals[`${pre.partida.nombre}`] || [];
    totals[`${pre.partida.nombre}`].push({
      importe: pre.importe
    });
  });
  return totals;
}

function setHeaderCellStyle(sheet, celda, start, cell) {
  sheet.getRow(start).height = 57;
  let celltoChange = sheet.getCell(cell);
  celltoChange.style = Object.create(celltoChange.style);
  if (celda === 'B') {
    if (!sheet.getCell(cell + ':C' + start).isMerged)
      sheet.mergeCells(cell + ':C' + start);
  }
  celltoChange.border = sheet.getCell('A11').border;
  celltoChange.font = sheet.getCell('A11').font;
  celltoChange.alignment = sheet.getCell('A11').alignment;
  if (celda !== 'F' && celda !== 'G' && celda !== 'H') {
    celltoChange.fill = sheet.getCell('A11').fill;
    // sheet.getCell(cell).fill =  sheet.getCell('A11').fill;
  }
}

function setBodyCellStyle(sheet, celda, start, cell) {
  sheet.getRow(start).height = 40;
  let celltoChange = sheet.getCell(cell);
  celltoChange.style = Object.create(celltoChange.style);
  celltoChange.border = sheet.getCell('A11').border;
}

function setUnesedCellStyle(sheet, celda, start, cell) {
  sheet.getRow(start).height = 40;
  let celltoChange = sheet.getCell(cell);
  celltoChange.style = Object.create(celltoChange.style);
  celltoChange.fill = {
    bgColor: '969696'
  };
  celltoChange.border = sheet.getCell('A11').border;
}

function addImage(sheet, imgId, rango) {
  sheet.addImage(imgId, rango);
}

// Esta funcion era para el framework SheetJs XLSX
// function addCellToSheet(worksheet, address, value) {
//   /* cell object */
//   const cell = { t: '?', v: value, w: value };
//   /* assign type */
//   if (typeof value === 'string') {  // string
//     cell.t = 's';
//   } else if (typeof value === 'number') { // number
//     cell.t = 'n';
//   } else if (value === true || value === false) { // boolean
//     cell.t = 'b';
//   } else if (value instanceof Date) {
//     cell.t = 'd';
//   } else {
//     throw new Error('cannot store value');
//   }
//   /* add to worksheet, overwriting a cell if it exists */
//   worksheet[address] = cell;
//   /* find the cell range */
//   const range = XLSX.utils.decode_range(worksheet['!ref']);
//   const addr = XLSX.utils.decode_cell(address);
//   /* extend the range to include the new cell */
//   if (range.s.c > addr.c) { range.s.c = addr.c; }
//   if (range.s.r > addr.r) { range.s.r = addr.r; }
//   if (range.e.c < addr.c) { range.e.c = addr.c; }
//   if (range.e.r < addr.r) { range.e.r = addr.r; }
//   /* update range */
//   worksheet['!ref'] = XLSX.utils.encode_range(range);
// }