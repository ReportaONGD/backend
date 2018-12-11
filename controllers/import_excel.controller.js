const Excel = require('exceljs');
const mongoose = require('mongoose');
const moment = require('moment');
const ExcelConfig = require('../models/excel_config/excel_config');
// MODELOS 
const Implementador = mongoose.model('Agente');
const Pais = mongoose.model('Pais');
const Proyecto = mongoose.model('Proyecto');
const Categoria = mongoose.model('Categoria');
const CuentaBancaria = mongoose.model('CuentaBancaria');
const Modificacion = mongoose.model('Modificacion');
const Localizacion = mongoose.model('Localizacion');
const Moneda = mongoose.model('Moneda');
const Hipotesis = mongoose.model('Hipotesis');
const Objetivo = mongoose.model('Objetivo');
const Gasto = mongoose.model('Gasto');
const Indicador = mongoose.model('Indicador');
const Comentario = mongoose.model('Comentario');
const Resultado = mongoose.model('Resultado');
const Partida = mongoose.model('Partida');
const Actividad = mongoose.model('Actividad');
const Convocatoria = mongoose.model('Convocatoria');
const PlanificacionActividad = mongoose.model('PlanificacionActividad');
const EjecucionActividad = mongoose.model('EjecucionActividad');
const Etapa = mongoose.model('Etapa');
const Informe = mongoose.model('Informe');
const FuenteVerificacion = mongoose.model('FuenteVerificacion');
const Periodo = mongoose.model('Periodo');
const TipoPeriodo = mongoose.model('TipoPeriodo');
const Contrato = mongoose.model('Contrato');
const Persona = mongoose.model('Persona');
const TipoPersonal = mongoose.model('TipoPersonal');
// VARIABLES
let cont_matriz;
let promises = []
let paises_project_promise = [];
let paises_project = [];
let categorias_promise = [];
let categorias = [];
let contratos = [];
let contratos_promise = [];
let modificaciones = [];
let modificaciones_promise = [];
let objetivos_especificos = [];
let objetivos_especificos_promise = [];
let indicadoresObj = [];
let indicadoresObj_promise = [];
let indicadoresObjEs = [];
let indicadoresObjEs_promise = [];
let hipotesisObjEs = [];
let hipotesisObjEs_promise = [];
let indicadoresResultado = [];
let indicadoresResultado_promise = [];
let indicadoresFuentes = [];
let indicadoresFuentes_promise = [];
let hipotesisResultado = [];
let hipotesisResultado_promise = [];
let actividadesResultado = [];
let actividadesResultado_promise = [];
let resultados = [];
let resultados_promise = [];
let objetivoA = new Objetivo();
let objetivo_promise = [];
let informes = [];
let informe1 = new Informe();
let informe2 = new Informe();
let informeFinal = new Informe();
let informes_promise = [];
let periodos = [];
let periodos_promise = [];
let tipo_personal = [];
let implementador = [];
let implementadorString = [];
let sociosLocales = [];
let sociosLocalesString = [];
let financiador = [];
let financiadorString = [];
let implementador_promise = [];
let implementadoresA = [];
let categoriasA = [];
let paisesA = [];
let monedasA = [];
let contratosA = [];
let tiposPeriodosA = [];
let modificacionA = [];
let convocatoriasA = [];
let partidasA = [];
let proyectosA = [];
let socio_local;
let etapaA = new Etapa();
exports.post_file = function (req, res, next) {
  promises = []
  paises_project_promise = [];
  paises_project = [];
  categorias_promise = [];
  categorias = [];
  contratos = [];
  contratos_promise = [];
  modificaciones = [];
  modificaciones_promise = [];
  objetivos_especificos = [];
  objetivos_especificos_promise = [];
  indicadoresObj = [];
  indicadoresObj_promise = [];
  indicadoresObjEs = [];
  indicadoresObjEs_promise = [];
  hipotesisObjEs = [];
  hipotesisObjEs_promise = [];
  indicadoresResultado = [];
  indicadoresResultado_promise = [];
  indicadoresFuentes = [];
  indicadoresFuentes_promise = [];
  hipotesisResultado = [];
  hipotesisResultado_promise = [];
  actividadesResultado = [];
  actividadesResultado_promise = [];
  resultados = [];
  resultados_promise = [];
  objetivo_promise = [];
  informes = [];
  informes_promise = [];
  periodos = [];
  periodos_promise = [];
  tipo_personal = [];
  implementador = [];
  implementadorString = [];
  sociosLocales = [];
  sociosLocalesString = [];
  financiador = [];
  financiadorString = [];
  implementador_promise = [];
  implementadoresA = [];
  categoriasA = [];
  paisesA = [];
  monedasA = [];
  contratosA = [];
  tiposPeriodosA = [];
  modificacionA = [];
  convocatoriasA = [];
  partidasA = [];
  proyectosA = [];
  
  const empresa = req.current_user.empresa;
  const proyecto = new Proyecto({ empresa: empresa });
  const ruta = './uploads/excel_imports/';
  const wb = new Excel.Workbook();

  if (!req.file) {
    return res.sendStatus(404);
  }

  Proyecto.find().then((proyectosArray) => {
    proyectosA = proyectosArray;
  Partida.find().then((partidasArray) => {
    partidasA = partidasArray;
  Convocatoria.find().then((convocatoriasArray) => {
    convocatoriasA = convocatoriasArray;
  Moneda.find().then((monedasArray) => {
    monedasA = monedasArray;
    Implementador.find({ empresa: empresa }).then((implementadoresArray) => {
      implementadoresA = implementadoresArray;
      Categoria.find({ empresa: empresa }).then((categoriasArray) => {
        categoriasA = categoriasArray;
        Pais.find({ empresa: empresa }).then((paisesCat) => {
          paisesA = paisesCat;
          Contrato.find({ empresa: empresa }).then((contratosArray) => {
            contratosA = contratosArray;
            TipoPeriodo.find().then((tiposPeriodosArray) => {
              tiposPeriodosA = tiposPeriodosArray;
              Modificacion.find().then((modificacionArray) => {
                modificacionA = modificacionArray;
                // TODO: DESCOMENTAR CUANDO ESTE TODO ACABADO
                TipoPersonal.find({ empresa: empresa }).then((tp) => {
                  tipo_personal = tp;
                  wb.xlsx.readFile(ruta + req.file.filename).then(() => {
                    wb.eachSheet(function (worksheet, sheetId) {
                      //TODO: Cambiar el valor de true por el de la variable final
                      if (worksheet.name.indexOf('Datos Generales') > -1 || worksheet.name.indexOf('personal') > -1) {
                        if (worksheet.name.indexOf('Datos Generales') > -1) {
                          proyecto.codigo = worksheet.getCell(ExcelConfig.ExcelConfig.DESCRIPCION.codigo).value;
                        }
                        setFinanciador(worksheet);
                        setCatalogos(worksheet.name, worksheet, empresa, proyecto).then(() => {
                          getDataSheet(worksheet.name, worksheet, empresa, proyecto);
                        }).catch((err) => {
                          console.log(err);  
                        });
                      } else {
                        getDataSheet(worksheet.name, worksheet, empresa, proyecto);
                      }
                    });

                    let financiadoresPro = [];
                    financiadorString.forEach(element => {
                      const financiadores_filter = implementadoresA.filter((item) => {
                        return item.nombre.toLowerCase() === element.toLowerCase();
                      });
                      if (financiadores_filter.length > 0) {
                        financiadoresPro.push(financiadores_filter[0]);
                      }
                    });

                    let sociosPro = [];
                    sociosLocalesString.forEach(element => {
                      const socios_filter = implementadoresA.filter((item) => {
                        return item.nombre.toLowerCase() === element.toLowerCase();
                      });
                      if (socios_filter.length > 0) {
                        sociosPro.push(socios_filter[0]);
                      }
                    });

                    const gestor_filter = implementadoresA.filter((item) => {
                      return item.nombre.toLowerCase() === socio_local.toLowerCase();
                    });

                    let convocatoriaP = convocatoriasA.filter((c) => {
                      return c.nombre.toLowerCase() === "aecid";
                    });
                    if (convocatoriaP.length > 0) {
                      convocatoriaP = convocatoriaP[0];
                      proyecto.convocatoria = convocatoriaP;
                    }
                    const partidas_filter = partidasA.filter((item) => {
                      return item.convocatoria.financiador.id === proyecto.convocatoria.financiador.id;
                    });
                    proyecto.partida = partidas_filter;
                    proyecto.financiador = financiadoresPro;
                    proyecto.implementador = sociosPro;
                    proyecto.gestor = gestor_filter[0];
                    let proyecto_filter = proyectosA.filter((p) => {
                      return p.codigo.toLowerCase() === proyecto.codigo.toLowerCase();
                    });
                    if (proyecto_filter.length > 0) {
                      return res.status(404).json({ error: "El proyecto seleccionado ya ha sido importado anteriormente!" });
                    }
                    proyecto.save().then((proyecto) => {
                      console.log({ message: "OK!!!!!!" }); 
                      return res.json({ message: "OK!!!!!!" });
                    }).catch((err) => {
                      console.log(err); 
                    });
                  }).catch((err) => {
                    console.log(err);
                  });
                }).catch((err) => {
                  console.log(err);
                });
              }).catch((err) => {
                console.log(err); 
              });
            }).catch((err) => {
              console.log(err); 
            });
          }).catch((err) => {
            console.log(err); 
          });
        }).catch((err) => {
          console.log(err); 
        });
      }).catch((err) => {
        console.log(err); 
      });
    }).catch((err) => {
      console.log(err); 
    });
  }).catch((err) => {
    console.log(err); 
  });
  }).catch((err) => {
    console.log(err); 
  });
  }).catch((err) => {
    console.log(err); 
  });
  }).catch((err) => {
    console.log(err); 
  });

}

function getDataSheet(wsname, sheet, empresa, project) {
  if (wsname.indexOf('Datos Generales') > -1) {
    //TODO: TERMINAR
    setDatosGenerales(sheet, empresa, project);
  } else if (wsname.indexOf('personal') > -1) {
    setPersonal(sheet,empresa, project);
  } else if (wsname.indexOf('Descripción proyecto') > -1) {
    setDescripcionDetallada(sheet, project);
  } else if (wsname.indexOf('Matriz') > -1) {
    setMatrizPlanificacion(sheet, empresa, project);
  } else if (wsname.indexOf('tesorería') > -1) {
    setEstadoTesoreria(sheet, empresa, project);
  } else if (wsname.indexOf('Incidencias') > -1) {
    setIncidencias(sheet, project);
  } else if (wsname.indexOf('Valoración general') > -1) {
    setValoracionGeneral(sheet, project);
  } else if (wsname.indexOf('Valoración por criterios') > -1) {
    setValoracionCriterios(sheet, project);
  } else if (wsname.indexOf('Listado de comprobantes') > -1) {
    //setGastos(sheet, project);
  } else if (wsname.indexOf('Entrega final') > -1) {
    setEntregaFinal(sheet, project);
  }
}
async function setCatalogos(wsname, sheet, empresa, project) {
  promises.push(new Promise((resolve, reject) => {
    if (wsname.indexOf('Datos Generales') > -1) {
      socio_local = sheet.getCell(ExcelConfig.CATALOGOS.socio_local).value;
      setPaises(sheet, ExcelConfig.CATALOGOS.paises, empresa).then((paises) => {
        resolve(paises);
        project.pais = paises_project;
        setImplementador(sheet.getCell(ExcelConfig.CATALOGOS.socio_local).value, sheet, empresa, project).then((socio) => {
          project.gestor = socio[0]._id;
          socio_local = socio[0]._id;
          console.log(JSON.stringify(socio));
        }).catch((err) => {
          reject(err)
        });
      }).catch((err) => { reject(err) });
      
    } else if (wsname.indexOf('personal') > -1) {
      setCategorias(ExcelConfig.CATALOGOS.categoria_profesional, sheet, empresa).then((categorias) => {
        console.log(JSON.stringify(categorias));
        setTipoContrato(ExcelConfig.CATALOGOS.tipo_contrato, sheet, empresa).then((contratos) => {
          resolve(contratos);
        }).catch((err) => {
           reject(err) 
        });
      }).catch((err) => {
        reject(err)
      });
    }
  }));

  console.log({ message: "catalogos" }); 
  return await Promise.all(promises);
}

async function setImplementador(nombre, sheet, empresa, project) {
  const socio_local_name = nombre;
  implementador_promise.push(new Promise((resolve, reject) => {
      if (implementadoresA && implementadoresA.length > 0) {
        const implemetadores_filter = implementadoresA.filter((item) => {
          return item.nombre.toLowerCase() === socio_local_name.toLowerCase();
        });
        if (implemetadores_filter && implemetadores_filter.length > 0) {
          implementador.push(implemetadores_filter[0]);
          resolve(implemetadores_filter[0]);
        } else {
          const impl = new Implementador({
            nombre: socio_local_name,
            descripcion: ' ',
            publico: false,
            pais: project ? project.pais[0]._id : null,
            socio_local: true,
            implementador: false,
            financiador: false,
            empresa: empresa
          });
          implementador.push(impl);
          impl.save().then((i) => {
            console.log(JSON.stringify(i));
            resolve(i);
          }).catch((err) => {
            reject(err)
          });
        }
      } else {
        const impl = new Implementador({
          nombre: socio_local_name,
          descripcion: ' ',
          publico: false,
          pais: project ? project.pais[0]._id : null,
          implementador: false,
          socio_local: true,
          financiador: false,
          empresa: empresa
        });
        implementador.push(impl);
        impl.save().then((i) => {
          console.log(JSON.stringify(i));
          resolve(i);
        }).catch((err) => {
          reject(err)
        });
      }
  }));
  return await Promise.all(implementador_promise);
}
async function setCategorias(catalogo, sheet, empresa) {
  const column = catalogo.column_start;
  for (let i = catalogo.row_start; i <= catalogo.row_end; i++) {
    if (sheet.getCell(column + i).value) {
      const categoria_nombre = sheet.getCell(column + i).value;
      categorias_promise.push(new Promise((resolve, reject) => {
          if (categoriasA && categoriasA.length > 0) {
            const categorias_filter = categoriasA.filter((c) => {
              return c.valor.toLowerCase() === categoria_nombre.toLowerCase();
            });
            if (categorias_filter && categorias_filter.length > 0) {
              categorias.push(categorias_filter[0]);
              resolve(categorias_filter[0]);
            } else {
              const cat = new Categoria({
                valor: categoria_nombre,
                empresa: empresa
              });
              cat.save().then(categoria => {
                categorias.push(categoria);
                resolve(categoria);
              }).catch((err) => {
                reject(err)
              });
            }
          } else {
            const cat = new Categoria({
              valor: categoria_nombre,
              empresa: empresa
            });
            cat.save().then(categoria => {
              categorias.push(categoria);
              resolve(categoria);
            }).catch((err) => {
              reject(err)
            });
          }
      }));
    }
  }
  return await Promise.all(categorias_promise);
}
async function setPaises(sheet, catalogo, empresa) {
  const paises = sheet.getCell(catalogo).value ? sheet.getCell(catalogo).value.split(',') : [];
  const moneda = monedasA.filter((item) => {
    return item.codigo.toLowerCase() === "usd";
  });
  paises.forEach(p => {
    paises_project_promise.push(new Promise((resolve, reject) => {
        if (paisesA && paisesA.length > 0) {
          let paises_filter = paisesA.filter((pais) => {
            return pais.valor.toLowerCase() === p.toLowerCase();
          });
          if (paises_filter && paises_filter.length > 0) {
            paises_project.push(paises_filter[0])
            resolve(paises_filter[0]);
          } else {
            const pais = new Pais({
              empresa: empresa,
              valor: p,
              moneda: moneda[0]
            });
            paises_project.push(pais);
            pais.save().then((pais) => {
              resolve(pais);
            }).catch((err) => {
              reject(err)
            });
          }
        } else {
          const pais = new Pais({
            empresa: empresa,
            valor: p
          });
          paises_project.push(pais);
          pais.save().then((newPais) => {
            resolve(newPais);
          }).catch((err) => {
            reject(err)
          });
        }
    }));

  });
  return await Promise.all(paises_project_promise);
}
async function setTipoContrato(catalogo, sheet, empresa) {
  const column = catalogo.column_start;
  for (let i = catalogo.row_start; i <= catalogo.row_end; i++) {

    if (sheet.getCell(column + i).value) {
      const contrato_nombre = sheet.getCell(column + i).value;
      contratos_promise.push(new Promise((resolve, reject) => {
          if (contratosA && contratosA.length > 0) {
            const contratos_filter = contratosA.filter((c) => {
              return c.valor.toLowerCase() === contrato_nombre.toLowerCase();
            });
            if (contratos_filter && contratos_filter.length > 0) {
              contratos.push(contratos_filter[0]);
              resolve(contratos_filter[0]);
            } else {
              const cont = new Contrato({
                valor: contrato_nombre,
                empresa: empresa
              });
              cont.save().then(contrato => {
                contratos.push(contrato);
                resolve(contrato);
              }).catch((err) => {
                reject(err)
              });
            }
          } else {
            const cont = new Contrato({
              valor: contrato_nombre,
              empresa: empresa
            });
            cont.save().then(contrato => {
              contratos.push(contrato);
              resolve(contrato);
            }).catch((err) => {
              reject(err)
            });
          }
      }));
    }
  }
  return await Promise.all(contratos_promise);
}
function setFinanciador(sheet) {
  const valor = sheet.getCell(ExcelConfig.ExcelConfig.DESCRIPCION.aportacion_ong).value;
  if (valor && valor != "" && valor != "0") {
    financiadorString.push("ONG_INT");
  }
  const valor2 = sheet.getCell(ExcelConfig.ExcelConfig.DESCRIPCION.aportacion_financiador).value;
  if (valor2 && valor2 != "" && valor2 != "0") {
    financiadorString.push("AECID");
  }
}
function setDatosGenerales(sheet, empresa, project) {

  // const projectPOJO = project.toObject();
  Object.keys(ExcelConfig.ExcelConfig.DESCRIPCION).forEach((key) => {
    if (key === 'pais') {
      project.pais = paises_project;
    } else if (key === 'modificaciones') {
      setModificaciones(sheet, project).then(() => {
        project.modificaciones = modificaciones;
      });
    } else if (key === 'entidad') {
      const entidades = (sheet.getCell(ExcelConfig.ExcelConfig.DESCRIPCION[key]).value).split(",");
      entidades.forEach(element => {
        if (element != "") {
          setImplementador(element, sheet, empresa, project);
        }
      });
    } else if (key === 'final' || key === 'informe_1' || key === 'informe_2') {
      if (sheet.getCell(ExcelConfig.ExcelConfig.DESCRIPCION[key].fecha_cierre_periodo).value != "") {
        setInformes(sheet, key, project).then(() => {
          project.informes = informes;
        }).catch((err) => {
          console.log(err);
        });
      }
    } else if (key === 'aportacion_ong') {
      const valor = sheet.getCell(ExcelConfig.ExcelConfig.DESCRIPCION[key]).value;
      if (valor && valor != "" && valor != "0") {
        financiadorString.push("ONG_INT");
      }
    } else if (key === 'aportacion_financiador') {
      const valor = sheet.getCell(ExcelConfig.ExcelConfig.DESCRIPCION[key]).value;
      if (valor && valor != "" && valor != "0") {        
        financiadorString.push("AECID");
      }
    } else if (key === 'titulo') {
      project[key] = sheet.getCell(ExcelConfig.ExcelConfig.DESCRIPCION[key]).value;
      project.nombre = sheet.getCell(ExcelConfig.ExcelConfig.DESCRIPCION[key]).value;
    } else {
      project[key] = sheet.getCell(ExcelConfig.ExcelConfig.DESCRIPCION[key]).value;
    }

  });
  console.log(JSON.stringify(paises_project));
  console.log({ message: "datosGenerales" }); 
}

async function setPeriodos(sheet, key, fecha_inicio, fecha_fin, project) {
  const fecha_cierre_periodo = fecha_fin;
  const fecha_elaboracion_informe = fecha_inicio;
  periodos_promise.push(new Promise((resolve, reject) => {
      const etapa = new Etapa({
        nombre: "Etapa",
        proyecto: project._id,
        fecha_inicio: new Date(moment(fecha_elaboracion_informe, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')),
        fecha_fin: new Date(moment(fecha_cierre_periodo, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')),
        descripcion: ""
      });
      etapa.save().then(etapa => {
        etapaA = etapa;
      }).catch((err) => {
        reject(err)
      });
      const periodo = new Periodo({
        nombre: "Periodo",
        proyecto: project._id,
        fecha_inicio: new Date(moment(fecha_elaboracion_informe, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')),
        fecha_fin: new Date(moment(fecha_cierre_periodo, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')),
        tipo_periodo: key == "final" ? tiposPeriodosA[1] : tiposPeriodosA[0] 
      });
      periodo.save().then(periodo => {
        periodos.push(periodo);
        resolve([periodo]);
      }).catch((err) => {
        reject(err)
      });
  }));
  return await Promise.all(periodos_promise);
}
async function setInformes(sheet, key, project) {
  const fecha_inicio = sheet.getCell(ExcelConfig.ExcelConfig.DESCRIPCION[key].fecha_elaboracion_informe).value;
  const fecha_fin = sheet.getCell(ExcelConfig.ExcelConfig.DESCRIPCION[key].fecha_cierre_periodo).value;

  
  if (fecha_inicio != null && fecha_fin != null) {
    setPeriodos(sheet, key, fecha_inicio, fecha_fin, project).then((periodo) => {
      const informe_autor = sheet.getCell(ExcelConfig.ExcelConfig.DESCRIPCION[key].autor).value;
      informes_promise.push(new Promise((resolve, reject) => {
        /* if (informes && informes.length > 0) {
          const informes_filter = informes.filter((c) => {
            return c.nombre.toLowerCase() === informe_autor.toLowerCase();
          });
          if (informes_filter && informes_filter.length > 0) {
            informes.push(informes_filter[0]);
            resolve(informes_filter[0]);
          } else {
            const informe = new Informe({
              proyecto_padre_id: null,
              proyecto: project._id,
              periodo: periodo[(periodo.length - 1)][0],
              nombre: "Informe",
              autor: informe_autor,
              final: false,
              valoracion_general: "",
              grado_de_alineamiento: "",
              puntos_fuertes_debiles: "",
              observaciones: "",
              modificacion_proyecto_inicial: "",
              pertinencia: "",
              coherencia: "",
              eficacia_impacto: "",
              eficiencia: "",
              viabilidad_sostenibilidad: "",
              amortizacion: "",
              cobertura: "",
              otros_criterios: "",
              finalizacion_transferencia: "",
              receptividad_sociolocal: "",
              visibilidad_complementariedad: "",
              nuevas_actividades_npi: "",
              actividades_previstas: "",
              modificaciones_accidentales: "",
              modificaciones_sustanciales: ""
            });

            if (key == "informe_1") {
              informe1.proyecto = project._id;
              informe1.periodo = periodo[(periodo.length - 1)][0];
              informe1.autor = informe_autor;
              informe1.nombre = "intermedio1";
              informe1.save().then(informe => {
                informes.push(informe);
              }).catch((err) => {
                console.log(err);
              });
            } else if (key == "informe_2") {
              informe2.proyecto = project._id;
              informe2.periodo = periodo[(periodo.length - 1)][0];
              informe2.autor = informe_autor;
              informe2.nombre = "intermedio2";
              informe2.save().then(informe => {
                informes.push(informe);
              }).catch((err) => {
                console.log(err);
              });
            } else if (key == "final") {
              informeFinal.proyecto = project._id;
              informeFinal.periodo = periodo[(periodo.length - 1)][0];
              informeFinal.autor = informe_autor;
              informeFinal.nombre = "final";
              informeFinal.final = true;
              informeFinal.save().then(informe => {
                informes.push(informe);
              }).catch((err) => {
                console.log(err);
              });
            }

          }
        } else { */
          const informe = new Informe({
            proyecto_padre_id: null,
            proyecto: project._id,
            periodo: periodo[(periodo.length - 1)][0],
            nombre: "Informe",
            autor: informe_autor,
            final: false,
            valoracion_general: "",
            grado_de_alineamiento: "",
            puntos_fuertes_debiles: "",
            observaciones: "",
            modificacion_proyecto_inicial: "",
            pertinencia: "",
            coherencia: "",
            eficacia_impacto: "",
            eficiencia: "",
            viabilidad_sostenibilidad: "",
            amortizacion: "",
            cobertura: "",
            otros_criterios: "",
            finalizacion_transferencia: "",
            receptividad_sociolocal: "",
            visibilidad_complementariedad: "",
            nuevas_actividades_npi: "",
            actividades_previstas: "",
            modificaciones_accidentales: "",
            modificaciones_sustanciales: ""
          });
          if (key == "informe_1") {
            informe1.proyecto = project._id;
            informe1.periodo = periodo[(periodo.length - 1)][0];
            informe1.autor = informe_autor;
            informe1.nombre = "intermedio1";
            /* informe1.save().then(informe => {
              informes.push(informe);
            }).catch((err) => {
              console.log(err);
            }); */
          } else if (key == "informe_2") {
            informe2.proyecto = project._id;
            informe2.periodo = periodo[(periodo.length - 1)][0];
            informe2.autor = informe_autor;
            informe2.nombre = "intermedio2";
            /* informe2.save().then(informe => {
              informes.push(informe);
            }).catch((err) => {
              console.log(err);
            }); */
          } else if (key == "final") {
            informeFinal.proyecto = project._id;
            informeFinal.periodo = periodo[(periodo.length - 1)][0];
            informeFinal.autor = informe_autor;
            informeFinal.nombre = "final";
            informeFinal.final = true;
            /* informeFinal.save().then(informe => {
              informes.push(informe);
            }).catch((err) => {
              console.log(err);
            }); */
          }
          
          
          
        /* } */
      }));
    });
  }
  return await Promise.all(informes_promise);
}
async function setModificaciones(sheet, project) {
  const column = ExcelConfig.ExcelConfig.DESCRIPCION.modificaciones.column;
  const start = ExcelConfig.ExcelConfig.DESCRIPCION.modificaciones.start;
  const end = ExcelConfig.ExcelConfig.DESCRIPCION.modificaciones.end;
  for (let index = start; index < end; index++) {
    if (sheet.getCell(column + index).value != "") {
      const texto = sheet.getCell(column + index).value;
      if (texto != null) {
        const modificacion_desc = texto.split(',');
        let modificacion_fecha = "";
        let modificacion_descripcion = "";
        if (modificacion_desc.length > 1) {
          modificacion_descripcion = modificacion_desc[0];
          modificacion_fecha = modificacion_desc[1];
        } else {
          modificacion_fecha = new Date();
          modificacion_descripcion = modificacion_desc[0];
        }

        modificaciones_promise.push(new Promise((resolve, reject) => {
            /* if (modificacionA && modificacionA.length > 0) {
              const modificaciones_filter = modificacionA.filter((c) => {
                return c.descripcion.toLowerCase() === modificacion_descripcion.toLowerCase();
              });
              if (modificaciones_filter && modificaciones_filter.length > 0) {
                modificaciones.push(modificaciones_filter[0]);
                resolve(modificaciones_filter[0]);
              } else {
                const modif = new Modificacion({
                  descripcion: modificacion_descripcion,
                  fecha: modificacion_fecha,
                  proyecto: project._id
                });
                modif.save().then(modificacion => {
                  modificaciones.push(modificacion);
                  resolve(modificacion);
                }).catch((err) => {
                  reject(err)
                });
              }
            } else { */
              const modif = new Modificacion({
                descripcion: modificacion_descripcion,
                fecha: modificacion_fecha,
                proyecto: project._id
              });
              modif.save().then(modificacion => {
                modificaciones.push(modificacion);
                resolve(modificacion);
              }).catch((err) => {
                reject(err)
              });
            /* } */
        }));
      }
    }
  }
  return await Promise.all(modificaciones_promise);
}

function setFuentesVerificacion(indicador_fuente_verificacion, indicador, sheet) {
  if (indicador_fuente_verificacion != null) {
    const fuentes_verificacion = indicador_fuente_verificacion.split('-');
    if (fuentes_verificacion.length > 0) {
      fuentes_verificacion.forEach(fuente => {
        const fuenteN = new FuenteVerificacion({
          codigo: "COD",
          descripcion: fuente,
          indicador: indicador._id
        });
        fuenteN.save().then(fuente => {
          indicadoresFuentes.push(fuente);
        }).catch((err) => {
          reject(err)
        });
      });
    }
  }
}

async function setHipotesis(sheet, objetivo, project, titulo, cont, tipo) {

  let nextItemStart = 0;
  let nextItemEnd = 0;
  let bool = false;
  let contt = cont;

  hipotesisObjEs_promise.push(new Promise((resolve, reject) => {
    while (!bool) {
      const descripcion = sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.descripcion + contt).value;
      if (descripcion.indexOf("Hipótesis") > -1) {
        nextItemStart = contt + 1;
      } else if (descripcion.indexOf(titulo) > -1) {
        nextItemEnd = contt;
        bool = true;
      }
      contt++;
    }

    for (let index = nextItemStart; index < nextItemEnd; index++) {
      const descripcion = sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.descripcion + index).value;
      if (descripcion != null) {
        const Hipo = new Hipotesis({
          descripcion: descripcion,
          [tipo]: objetivo._id
        });
        Hipo.save().then(hipo => {
          hipotesisObjEs.push(hipo);
        }).catch((err) => {
          reject(err)
        });
      }
    }

    cont_matriz = nextItemEnd;
    contt = nextItemEnd;
    resolve(contt);
  }));
  return await Promise.all(hipotesisObjEs_promise);
}

async function setIndicadores(sheet, objetivo, tiutlo, cont, tipo) {

  const indicador_cells = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador;
  let contt = cont;
    indicadoresObj_promise.push(new Promise((resolve, reject) => { 
      while (((sheet.getCell((indicador_cells.descripcion + contt)).value) != null) && ((sheet.getCell(indicador_cells.descripcion + contt).value).indexOf(tiutlo) == -1) ) {
        const indicador_codigo_descripcion = (sheet.getCell(indicador_cells.descripcion + contt).value).split(':');
        let indicador_codigo = "";
        let indicador_descripcion = "";
        let indicador_comentarios_string = [];
        let indicador_comentario_string = "";
        const indicador_linea = sheet.getCell(indicador_cells.linea_base + contt).value;
        const indicador_meta = sheet.getCell(indicador_cells.meta + contt).value;
        if (sheet.getCell(indicador_cells.comentarios + contt).value != null && sheet.getCell(indicador_cells.comentarios + contt).value != "") {
          indicador_comentarios_string.push(sheet.getCell(indicador_cells.comentarios + contt).value);
          indicador_comentario_string = sheet.getCell(indicador_cells.comentarios + contt).value;
        }
        const indicador_fuente_verificacion = sheet.getCell(indicador_cells.fuente_verificacion + contt).value;
        const indicador_comentarios_ong = sheet.getCell(indicador_cells.comentarios_ong + contt).value;
        const indicador_comentarios_aecid = sheet.getCell(indicador_cells.comentarios_aecid + contt).value;
        
        if ((sheet.getCell(indicador_cells.descripcion + contt).value) != null) {
          
          if (indicador_codigo_descripcion.length > 1) {
            indicador_codigo = indicador_codigo_descripcion[0];
            indicador_descripcion = indicador_codigo_descripcion[1];
          } else {
            indicador_codigo = "I.O.G";
            indicador_descripcion = indicador_codigo_descripcion[0];
          }
          
          const indicador = new Indicador({
            codigo: indicador_codigo,
            descripcion: indicador_descripcion,
            linea_base: indicador_linea,
            [tipo]: objetivo._id,
            meta: indicador_meta,
            comentario: indicador_comentario_string,
            comentarios: null,
            comentarios_ong: indicador_comentarios_ong,
            comentarios_aecid: indicador_comentarios_aecid
          });
          indicador.save().then(indicador => {
            indicadoresObj.push(indicador);
            setFuentesVerificacion(indicador_fuente_verificacion, indicador, sheet);
            resolve(indicador);
          }).catch((err) => {
            reject(err)
          });
          cont_matriz++;
          contt++;
        }
      }
    }));
  
  return await Promise.all(indicadoresObj_promise);
}

async function setActividades(sheet, resultado, project, titulo, cont) {

  let nextItemStart = 0;
  let nextItemEnd = 0;
  let bool = false;
  let contt = cont;

  while (!bool) {
    const descripcion = sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.descripcion + contt).value;
    if (descripcion.indexOf("Actividades") > -1) {
      nextItemStart = contt + 1;
    } else if (descripcion.indexOf(titulo) > -1) {
      nextItemEnd = contt;
      bool = true;
    }
    contt++;
    cont_matriz++;
  }

  for (let index = nextItemStart; index < nextItemEnd; index++) {
    const codigo_descripcion = (sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.descripcion + index).value).split(':');
    const comentarios = (sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador.comentarios + index).value);
    let comentariosArray = [];
    comentariosArray.push(comentarios);
    let codigo = "";
    let descripcion = "";
    if (codigo_descripcion.length > 1) {
      codigo = codigo_descripcion[0];
      descripcion = codigo_descripcion[1];
    } else {
      codigo = "Actividad";
      descripcion = codigo_descripcion[0];
    }

    actividadesResultado_promise.push(new Promise((resolve, reject) => {
      const actividad = new Actividad({
        codigo: codigo,
        descripcion: descripcion,
        resultado: resultado._id,
        comentarios: comentariosArray,
        etapa: etapaA,
        planificacion_actividad: new PlanificacionActividad({ fecha_inicio: "", fecha_fin: ""}),
        ejecucion_actividad: new EjecucionActividad({ fecha_inicio: "", fecha_fin: ""})
      });
      actividad.save().then(actividad => {
        actividadesResultado.push(actividad);
        resolve(actividad);
      }).catch((err) => {
        reject(err)
      });
    }));
  }

  contt = nextItemEnd;
  cont_matriz = nextItemEnd;
  return await Promise.all(actividadesResultado_promise);
}
async function setResultados(sheet, objetivo, project, titulo, cont) {
  let contt = cont;
  resultados_promise.push(new Promise((resolve, reject) => {
  if (sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.descripcion + contt) != titulo) {
    
    const codigo_descripcion = (sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.descripcion + contt).value).split(':');
    let codigo = "";
    let descripcion = "";
    if (codigo_descripcion.length > 1) {
      codigo = codigo_descripcion[0];
      descripcion = codigo_descripcion[1];
    } else {
      codigo = "Resultado";
      descripcion = codigo_descripcion[0];
    }
    
      const resultado = new Resultado({
        codigo: codigo,
        descripcion: descripcion,
        objetivo: objetivo._id,
        comentarios: null
      });
      resultado.save().then(resultado => {
        resultados.push(resultado);
        resolve([cont = contt, resultadoF = resultado]);
      }).catch((err) => {
        reject(err)
      });
      
    }else{
    resolve([cont = contt, resultadoF = null]);
    }
  }));
  return await Promise.all(resultados_promise);

}
async function setObjetivo(sheet, project, esGeneral, contO) {
  let cont = contO;
  let contI = contO;
  const codigo_descripcion = (sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.descripcion + cont).value).split(':');
  let codigo = "";
  let descripcion = "";
  if (codigo_descripcion.length > 1) {
    codigo = codigo_descripcion[0];
    descripcion = codigo_descripcion[1];
  } else {
    if (esGeneral) {
      codigo = "O.G";
    }else{
      codigo = "O.E";
    }
    descripcion = codigo_descripcion[0];
  }

  objetivo_promise.push(new Promise((resolve, reject) => {
    const objetivo = new Objetivo({
      codigo: codigo,
      descripcion: descripcion,
      general: esGeneral,
      proyecto: project._id
    });
    objetivo.save().then(objetivo => {
      if (esGeneral) {
        objetivoA = objetivo;
      }else{
        objetivos_especificos.push(objetivo);
          cont++;
          setIndicadores(sheet, objetivo, "Definición indicadores del Resultado", contI, "objetivo").catch((err) => {
            reject(err)
          });
        setHipotesis(sheet, objetivo, project, "Resultado", (contI + 1), "objetivo");
        while ((sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.descripcion + cont).value) != "Objetivo específico" && (sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.descripcion + cont).value) != "TOTALES") {
          if ((sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.descripcion + cont).value)) {
            
            if ((sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.descripcion + cont).value).indexOf("Resultado") > -1) {
              cont++;
              setResultados(sheet, objetivo, project, "Hipótesis", cont).then((resultado) => {
                setIndicadores(sheet, resultado[(resultado.length - 1)][1], "Costes", resultado[(resultado.length - 1)][0], "resultado").catch((err) => {
                  reject(err)
                });
                setHipotesis(sheet, resultado[(resultado.length - 1)][1], project, "Actividades", (resultado[(resultado.length - 1)][0]), "resultado").then((contR) => {
                  setActividades(sheet, resultado[(resultado.length - 1)][1], project, "Coste total previsto", contR[(contR.length - 1)]);
                }).catch((err) => {
                  reject(err)
                });
              }).catch((err) => {
                reject(err)
              });
            }
          } 
            cont++;
          }
          cont_matriz = cont;
      }
      resolve([cont,objetivo]);
    }).catch((err) => {
      reject(err)
    });
  }));

  return await Promise.all(objetivo_promise);
}

function setGastos(sheet, project) {

  let start = ExcelConfig.ExcelConfig.DOCUMENTOS.start;

  while (shett.getCell(ExcelConfig.ExcelConfig.DOCUMENTOS.concepto + start).value != 'TOTAL') {
    const numero_orden = shett.getCell(ExcelConfig.ExcelConfig.DOCUMENTOS.numero_orden + start).value;
    const fecha = shett.getCell(ExcelConfig.ExcelConfig.DOCUMENTOS.fecha + start).value;
    const emisor = shett.getCell(ExcelConfig.ExcelConfig.DOCUMENTOS.emisor + start).value;
    const concepto = shett.getCell(ExcelConfig.ExcelConfig.DOCUMENTOS.concepto + start).value;
    const importe = shett.getCell(ExcelConfig.ExcelConfig.DOCUMENTOS.euros + start).value;
    const partida = partidasA.filter((item) => {
      return (shett.getCell(ExcelConfig.ExcelConfig.DOCUMENTOS.concepto + start).value).indexOf(item.codigo) != -1;
    });
    const moneda = monedasA.filter((item) => {
      return item.codigo.toLowerCase() === "eur";
    });
    if (partida && partida.lengt > 0) {
      const gasto = new Gasto({
        proyecto: project._id,
        fecha: fecha,
        emisor: emisor,
        concepto: concepto,
        numero_orden: numero_orden,
        importe_local: importe,
        moneda: monda[0],
        partida: partida[0]
      });
    }

  }

}
function setValoracionGeneral(sheet, project) {

  Object.keys(ExcelConfig.ExcelConfig.INCIDENCIAS).forEach((key) => {
    if (key == "informe_1") {
      informe1.valoracion_general = sheet.getCell(ExcelConfig.ExcelConfig.VALORACION_GENERAL[key].valoracion_general).value;
      informe1.grado_de_alineamiento = sheet.getCell(ExcelConfig.ExcelConfig.VALORACION_GENERAL[key].grado_de_alineamiento).value;
      informe1.puntos_fuertes_debiles = sheet.getCell(ExcelConfig.ExcelConfig.VALORACION_GENERAL[key].puntos_fuertes_debiles).value;
      informe1.observaciones = sheet.getCell(ExcelConfig.ExcelConfig.VALORACION_GENERAL[key].observaciones).value;
    } else if (key == "informe_2") {
      informe2.valoracion_general = sheet.getCell(ExcelConfig.ExcelConfig.VALORACION_GENERAL[key].valoracion_general).value;
      informe2.grado_de_alineamiento = sheet.getCell(ExcelConfig.ExcelConfig.VALORACION_GENERAL[key].grado_de_alineamiento).value;
      informe2.puntos_fuertes_debiles = sheet.getCell(ExcelConfig.ExcelConfig.VALORACION_GENERAL[key].puntos_fuertes_debiles).value;
      informe2.observaciones = sheet.getCell(ExcelConfig.ExcelConfig.VALORACION_GENERAL[key].observaciones).value;
    } else if (key == "final") {
      informeFinal.valoracion_general = sheet.getCell(ExcelConfig.ExcelConfig.VALORACION_GENERAL[key].valoracion_general).value;
      informeFinal.grado_de_alineamiento = sheet.getCell(ExcelConfig.ExcelConfig.VALORACION_GENERAL[key].grado_de_alineamiento).value;
      informeFinal.puntos_fuertes_debiles = sheet.getCell(ExcelConfig.ExcelConfig.VALORACION_GENERAL[key].puntos_fuertes_debiles).value;
      informeFinal.observaciones = sheet.getCell(ExcelConfig.ExcelConfig.VALORACION_GENERAL[key].observaciones).value;
      informeFinal.modificacion_proyecto_inicial = sheet.getCell(ExcelConfig.ExcelConfig.VALORACION_GENERAL[key].modificacion_proyecto_inicial).value;
    }

  });

  console.log({ message: "valoracionGeneral" }); 
}
function setEntregaFinal(sheet, project) {
  informeFinal.finalizacion_transferencia = sheet.getCell(ExcelConfig.ExcelConfig.ENTREGA_FINAL.finalizacion_transferencia).value;
  informeFinal.receptividad_sociolocal = sheet.getCell(ExcelConfig.ExcelConfig.ENTREGA_FINAL.receptividad_sociolocal).value;
  informeFinal.visibilidad_complementariedad = sheet.getCell(ExcelConfig.ExcelConfig.ENTREGA_FINAL.visibilidad_complementariedad).value;

  console.log({ message: "entregaFinal" }); 

}
function setValoracionCriterios(sheet, project) {
    
  informeFinal.pertinencia = sheet.getCell(ExcelConfig.ExcelConfig.VALORACION_CRITERIOS.pertinencia).value;
    informeFinal.coherencia = sheet.getCell(ExcelConfig.ExcelConfig.VALORACION_CRITERIOS.coherencia).value;
    informeFinal.eficacia_impacto = sheet.getCell(ExcelConfig.ExcelConfig.VALORACION_CRITERIOS.eficacia_impacto).value;
    informeFinal.eficiencia = sheet.getCell(ExcelConfig.ExcelConfig.VALORACION_CRITERIOS.eficiencia).value;
    informeFinal.viabilidad_sostenibilidad = sheet.getCell(ExcelConfig.ExcelConfig.VALORACION_CRITERIOS.viabilidad_sostenibilidad).value;
    informeFinal.amortizacion = sheet.getCell(ExcelConfig.ExcelConfig.VALORACION_CRITERIOS.amortizacion).value;
    informeFinal.cobertura = sheet.getCell(ExcelConfig.ExcelConfig.VALORACION_CRITERIOS.cobertura).value;
    informeFinal.otros_criterios = sheet.getCell(ExcelConfig.ExcelConfig.VALORACION_CRITERIOS.otros_criterios).value;

  console.log({ message: "veloracionCriterios" }); 
}

function setIncidencias(sheet) {
  Object.keys(ExcelConfig.ExcelConfig.INCIDENCIAS).forEach((key) => {
    let modificaciones_sustanciales = [];
    const modificacionSusStart = ExcelConfig.ExcelConfig.INCIDENCIAS[key].modificaciones_sustanciales.start;
    const modificacionSusEnd = ExcelConfig.ExcelConfig.INCIDENCIAS[key].modificaciones_sustanciales.end;
    const modificacionSusCell = ExcelConfig.ExcelConfig.INCIDENCIAS[key].modificaciones_sustanciales.column;
    for (let index = modificacionSusStart; index <= modificacionSusEnd; index++) {
      const valor = sheet.getCell(modificacionSusCell + index).value;
      if (valor != null && valor != "") {
        modificaciones_sustanciales.push(valor);
      }
    }

    let modificaciones_accidentales = [];
    const modificacionAccStart = ExcelConfig.ExcelConfig.INCIDENCIAS[key].modificaciones_accidentales.start;
    const modificacionAccEnd = ExcelConfig.ExcelConfig.INCIDENCIAS[key].modificaciones_accidentales.end;
    const modificacionAccCell = ExcelConfig.ExcelConfig.INCIDENCIAS[key].modificaciones_accidentales.column;
    for (let index = modificacionAccStart; index <= modificacionAccEnd; index++) {
      const valor = sheet.getCell(modificacionAccCell + index).value;
      if (valor != null && valor != "") {
        modificaciones_accidentales.push(valor);
      }
    }

    let actividades_previstas = [];
    const actividadesPrevStart = ExcelConfig.ExcelConfig.INCIDENCIAS[key].actividades_previstas.start;
    const actividadesPrevEnd = ExcelConfig.ExcelConfig.INCIDENCIAS[key].actividades_previstas.end;
    const actividadesPrevCell = ExcelConfig.ExcelConfig.INCIDENCIAS[key].actividades_previstas.column;
    for (let index = actividadesPrevStart; index <= actividadesPrevEnd; index++) {
      const valor = sheet.getCell(actividadesPrevCell + index).value;
      if (valor != null && valor != "") {
        actividades_previstas.push(valor);
      }
    }

    let nuevas_actividades_npi = [];
    const actividadesNuevStart = ExcelConfig.ExcelConfig.INCIDENCIAS[key].nuevas_actividades_npi.start;
    const actividadesNuevEnd = ExcelConfig.ExcelConfig.INCIDENCIAS[key].nuevas_actividades_npi.end;
    const actividadesNuevCell = ExcelConfig.ExcelConfig.INCIDENCIAS[key].nuevas_actividades_npi.column;
    for (let index = actividadesNuevStart; index <= actividadesNuevEnd; index++) {
      const valor = sheet.getCell(actividadesNuevCell + index).value;
      if (valor != null && valor != "") {
        nuevas_actividades_npi.push(valor);
      }
    }

    if (key == "informe_1") {
      informe1.modificaciones_sustanciales = modificaciones_sustanciales;
      informe1.modificaciones_accidentales = modificaciones_accidentales;
      informe1.actividades_previstas = actividades_previstas;
      informe1.nuevas_actividades_npi = nuevas_actividades_npi;
    } else if (key == "informe_2") {
      informe2.modificaciones_sustanciales = modificaciones_sustanciales;
      informe2.modificaciones_accidentales = modificaciones_accidentales;
      informe2.actividades_previstas = actividades_previstas;
      informe2.nuevas_actividades_npi = nuevas_actividades_npi;
    } else if (key == "final") {
      informeFinal.modificaciones_sustanciales = modificaciones_sustanciales;
      informeFinal.modificaciones_accidentales = modificaciones_accidentales;
      informeFinal.actividades_previstas = actividades_previstas;
      informeFinal.nuevas_actividades_npi = nuevas_actividades_npi;
    }
  });

  console.log({ message: "Incidencias" }); 
}

function setMatrizPlanificacion(sheet, empresa, project) {
  const socio_local = (sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.DATOS_GENERALES.socio_local).value).split(",");
  cont_matriz = ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.indicador.start;
  socio_local.forEach(element => {
    if (element != "") {
      sociosLocalesString.push(element);
      setImplementador(element, sheet, empresa, project)
    }
  });

  /* etImplementador(socio_local, sheet, empresa, project).then((socio) => {
    project.gestor = socio[0]._id;
    socio_local = socio[0]._id;
  }); */
  setObjetivo(sheet, project, true, cont_matriz).then((objetivoG) => {
    project.objetivo = objetivoG[(objetivoG.length - 1)][1];
    setIndicadores(sheet, objetivoG[(objetivoG.length - 1)][1], "Definición indicadores del Objetivo específico", objetivoG[(objetivoG.length - 1)][0], "objetivo").catch((err) => {
      console.log(err);
    });
    while ((sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.descripcion + cont_matriz).value) != "TOTALES") {
      if ((sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.OBJETIVO_GENERAL.descripcion + cont_matriz).value).indexOf("Objetivo específico") > -1) {
        cont_matriz++;
        setObjetivo(sheet, project, false, cont_matriz).then((objetivoE) => {
          /* setIndicadores(sheet, objetivoE[(objetivoE.length - 1)][1], "Definición indicadores del Objetivo específico", objetivoE[(objetivoE.length - 1)][0]).catch((err) => {
            console.log(err);
          });
          setHipotesis(sheet, objetivoE[(objetivoE.length - 1)][1], project, "Resultado", objetivoE[(objetivoE.length - 1)][0]); */
        }).catch((err) => {
          console.log(err);
        });
      }
    cont_matriz++;
    }
  }).catch((err) => {
    console.log(err);
  });

  const titulo = sheet.getCell(ExcelConfig.ExcelConfig.MATRIZ_PLANIFICACION.DATOS_GENERALES.titulo).value;
  project.titulo = titulo;

  console.log({ message: "matriz" }); 

}

function setDescripcionDetallada(sheet, project) {
  project.descripcion = sheet.getCell(ExcelConfig.ExcelConfig.DESCRIPCION_DETALLADA.celda);

  console.log({ message: "descripcionProyecto" }); 
}

function setPersonal(sheet, empresa, project) {
  const start_row = ExcelConfig.ExcelConfig.PERSONAS.start;
  const end_row = ExcelConfig.ExcelConfig.PERSONAS.end;
  const personal = [];
  let persona;
  for (let i = start_row; i <= end_row; i++) {
    persona = new Persona();
    persona.proyecto = project._id;
    Object.keys(ExcelConfig.ExcelConfig.PERSONAS).forEach((key) => {
      if (key !== 'start' && key !== 'end') {
        const cell = ExcelConfig.ExcelConfig.PERSONAS[key] + i;
        if (sheet.getCell(cell).value) {
          if (key === 'contrato') {
            const contrato = contratos.filter((c) => {
              return c.valor.toLowerCase() === sheet.getCell(cell).value.toLowerCase();
            });
            persona[key] = contrato[0];
          } else if (key === 'categoria') {
            const categoria = categorias.filter((c) => {
              return c.valor.toLowerCase() === sheet.getCell(cell).value.toLowerCase();
            });
            persona[key] = categoria[0];
          } else if (key === 'tipo_personal') {
            const tp = tipo_personal.filter((c) => {
              return c.valor.toLowerCase() === sheet.getCell(cell).value.toLowerCase()
                || c.codigo.toLowerCase() === sheet.getCell(cell).value.toLowerCase();
            });
            persona[key] = tp[0];
          } else {
            persona[key] = sheet.getCell(cell).value;
          }
        }
      }
    });
    if (persona.nombre) {
      persona.save().then(persona => {
        personal.push(persona);
      }).catch((err) => {
        console.log(err);
      });
    }
  }
  console.log({ message: "personal" }); 
}

function setEstadoTesoreria(sheet, pais, project){

  const cell = ExcelConfig.ExcelConfig.ESTADO_TESORERIA.cuentas.column;
  const espStart = ExcelConfig.ExcelConfig.ESTADO_TESORERIA.cuentas.cuentas_bancarias_espana.start;
  const extStart = ExcelConfig.ExcelConfig.ESTADO_TESORERIA.cuentas.cuentas_bancarias_exterior.start;
  let moneda = new Moneda();
  let localizacion = new Localizacion();
  let paises_filter = new Pais();

  
    Localizacion.find().then((localizacionArray) => {
      localizacion = localizacionArray.filter((item) => {
        return item.valor.toLowerCase() === "nacional";
      });
      paises_filter = paisesA.filter((pais) => {
        return pais.valor.toLowerCase() === "spain";
      });
      if (sheet.getCell(cell + espStart).value != null && sheet.getCell(cell + espStart).value != "") {
        moneda = monedasA.filter((item) => {
          return item.codigo.toLowerCase() === (sheet.getCell(cell + (espStart + 2)).value).toLowerCase();
        });
        const cuentaEsp1 = new CuentaBancaria({
          proyecto: project._id,
          pais: paises_filter[0],
          entidad: sheet.getCell(cell + espStart).value,
          moneda: moneda[0],
          ncuenta: (sheet.getCell(cell + (espStart + 1)).value),
          localizacion: localizacion[0]
        });
        cuentaEsp1.save().then(cuenta => {
        }).catch((err) => {
          console.log(err);
        });
      }

      if (sheet.getCell(cell + (espStart + 3)).value != null && sheet.getCell(cell + (espStart + 3)).value != "") {
        moneda = monedasA.filter((item) => {
          return item.codigo.toLowerCase() === (sheet.getCell(cell + (espStart + 5)).value).toLowerCase();
        });
        const cuentaEsp2 = new CuentaBancaria({
          proyecto: project._id,
          pais: paises_filter[0],
          entidad: sheet.getCell(cell + (espStart + 3)).value,
          moneda: moneda[0],
          ncuenta: (sheet.getCell(cell + (espStart + 4)).value),
          localizacion: localizacion[0]
        });
        cuentaEsp2.save().then(cuenta => {
        }).catch((err) => {
          console.log(err);
        });
      }
      localizacion = localizacionArray.filter((item) => {
        return item.valor.toLowerCase() === "exterior";
      });
      
      if (sheet.getCell(cell + (extStart)).value != null && sheet.getCell(cell + (extStart)).value != "") {
        paises_filter = paisesA.filter((pais) => {
          return pais.valor.toLowerCase() === (sheet.getCell(cell + (extStart)).value).toLowerCase();
        });
        moneda = monedasA.filter((item) => {
          return item.codigo.toLowerCase() === (sheet.getCell(cell + (extStart + 3)).value).toLowerCase();
        });
        const cuentaExt1 = new CuentaBancaria({
          proyecto: project._id,
          pais: paises_filter[0],
          entidad: sheet.getCell(cell + (extStart + 1)).value,
          moneda: moneda[0],
          ncuenta: (sheet.getCell(cell + (extStart + 2)).value),
          localizacion: localizacion[0]
        });
        cuentaExt1.save().then(cuenta => {
        }).catch((err) => {
          console.log(err);
        });
      }
      if (sheet.getCell(cell + (extStart + 4)).value != null && sheet.getCell(cell + (extStart + 4)).value != "") {
        paises_filter = paisesA.filter((pais) => {
          return pais.valor.toLowerCase() === (sheet.getCell(cell + (extStart + 4)).value).toLowerCase();
        });
        moneda = monedasA.filter((item) => {
          return item.codigo.toLowerCase() === (sheet.getCell(cell + (extStart + 7)).value).toLowerCase();
        });
        const cuentaExt2 = new CuentaBancaria({
          proyecto: project._id,
          pais: paises_filter[0],
          entidad: sheet.getCell(cell + (extStart + 5)).value,
          moneda: moneda[0],
          ncuenta: (sheet.getCell(cell + (extStart + 6)).value),
          localizacion: localizacion[0]
        });
        cuentaExt2.save().then(cuenta => {
        }).catch((err) => {
          console.log(err);
        });
      }
    });

  console.log({ message: "estadoTesoreria" }); 

}