const ClientOAuth2 = require('client-oauth2');
const config = require('../config/env');
const popsicle = require('popsicle');
const mongoose = require('mongoose');
const utils = require('../utils/binding');
const GongConfig = require('../models/gong_config/gong_config');
// MODELOS 
const Implementador = mongoose.model('Agente');
const Pais = mongoose.model('Pais');
const Proyecto = mongoose.model('Proyecto');
const Categoria = mongoose.model('Categoria');
const CuentaBancaria = mongoose.model('CuentaBancaria');
const Modificacion = mongoose.model('Modificacion');
const Localizacion = mongoose.model('Localizacion');
const Convocatoria = mongoose.model('Convocatoria');
const Moneda = mongoose.model('Moneda');
const Hipotesis = mongoose.model('Hipotesis');
const Objetivo = mongoose.model('Objetivo');
const Indicador = mongoose.model('Indicador');
const Comentario = mongoose.model('Comentario');
const Partida = mongoose.model('Partida');
const Resultado = mongoose.model('Resultado');
const Actividad = mongoose.model('Actividad');
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
let implementador_promise = [];
let implementadoresA = [];
let categoriasA = [];
let localizacionA = [];
let proyectosA = [];
let paisesA = [];
let monedasA = [];
let contratosA = [];
let tiposPeriodosA = [];
let modificacionA = [];
let etapaA = new Etapa();
let sociosArray = [];
let financiadorArray = [];
let convocatoriasA = [];
let partidasA = [];
let gestorProyecto;
let actividadGlobalProyecto;
let proyectoGong;
let matrizGong;
let proyecto;
let personal;
let cuentas_bancarias;

exports.findAll = function (req, res, next) {

  var githubAuth = new ClientOAuth2({
    clientId: config.gong.clientId,
    clientSecret: config.gong.clientSecret,
    accessTokenUri: config.gong.accessTokenUri,
    authorizationUri: config.gong.authorizationUri,
  });

  githubAuth.credentials.getToken()
    .then(function (user) {
      console.log(user); //=> { accessToken: '...', tokenType: 'bearer', ... }
      return popsicle.request(user.sign({
        method: 'get',
        url: config.gong.apiUrl + '/proyectos'
      })).then(function (api_res) {
        console.log(JSON.parse(api_res.body)); //=> { body: { ... }, status: 200, headers: { ... } }
        return res.json(JSON.parse(api_res.body).proyecto);
      });
    });
};

exports.importar = function (req, res, next) {

  promises = []
  paises_project_promise = [];
  sociosArray = [];
  financiadorArray = [];
  
  const proyecto_id = req.params.id;
  const empresa = req.current_user.empresa;

  var githubAuth = new ClientOAuth2({
    clientId: config.gong.clientId,
    clientSecret: config.gong.clientSecret,
    accessTokenUri: config.gong.accessTokenUri,
    authorizationUri: config.gong.authorizationUri,
  });


  // Metodos del WS: 
  //  datos_generales
  //  matriz_seguimiento
  //  cronograma_seguimiento
  //  documentos_fuentes_verificacion
  //  resumen_financiero
  //  balance_presupuestario
  //  tesoreria
  //  personal
  //  transferencias
  //  bienes_adquiridos
  //  comprobantes


  githubAuth.credentials.getToken()
  .then(function (user) {
    console.log(user); //=> { accessToken: '...', tokenType: 'bearer', ... }
    return popsicle.request(user.sign({
      method: 'get',
      url: config.gong.apiUrl + '/proyectos/' + proyecto_id
    })).then(function (api_res) {
      console.log(JSON.parse(api_res.body)); //=> { body: { ... }, status: 200, headers: { ... } }
      proyecto = new Proyecto({ empresa: empresa });
      proyectoGong = JSON.parse(api_res.body).proyecto;
      utils.bindingObject(proyectoGong, proyecto);
      githubAuth.credentials.getToken()
      .then(function (user) {
        console.log(user); //=> { accessToken: '...', tokenType: 'bearer', ... }
        return popsicle.request(user.sign({
          method: 'get',
          url: config.gong.apiUrl + '/proyectos/' + proyecto_id + '/' + process.env.MATRIZ_SEGUIMIENTO
        })).then(function (api_res) {
          matrizGong = JSON.parse(api_res.body).matriz_seguimiento;
          githubAuth.credentials.getToken()
            .then(function (user) {
              console.log(user); //=> { accessToken: '...', tokenType: 'bearer', ... }
              return popsicle.request(user.sign({
                method: 'get',
                url: config.gong.apiUrl + '/proyectos/' + proyecto_id + '/' + process.env.PERSONAL
              })).then(function (api_res) {
                personal = JSON.parse(api_res.body).personal.personas;
                githubAuth.credentials.getToken()
                  .then(function (user) {
                    console.log(user); //=> { accessToken: '...', tokenType: 'bearer', ... }
                    return popsicle.request(user.sign({
                      method: 'get',
                      url: config.gong.apiUrl + '/proyectos/' + proyecto_id + '/' + process.env.TESORERIA
                    })).then(function (api_res) {
                      cuentas_bancarias = JSON.parse(api_res.body).tesoreria.cuentas;


                      Proyecto.find().then((proyectosArray) => {
                        proyectosA = proyectosArray;
                        Convocatoria.find().then((convocatoriasArray) => {
                          convocatoriasA = convocatoriasArray;
                      Partida.find().then((partidasArray) => {
                        partidasA = partidasArray;
                      Localizacion.find().then((localizacionArray) => {
                        localizacionA = localizacionArray;
                      Moneda.find().then((monedasArray) => {
                        monedasA = monedasArray;
                        Implementador.find().then((implementadoresArray) => {
                          implementadoresA = implementadoresArray;
                          Categoria.find().then((categoriasArray) => {
                            categoriasA = categoriasArray;
                            Pais.find().then((paisesCat) => {
                              paisesA = paisesCat;
                              Contrato.find().then((contratosArray) => {
                                contratosA = contratosArray;
                                TipoPeriodo.find().then((tiposPeriodosArray) => {
                                  tiposPeriodosA = tiposPeriodosArray;
                                  Modificacion.find().then((modificacionArray) => {
                                    modificacionA = modificacionArray;
                                    // TODO: DESCOMENTAR CUANDO ESTE TODO ACABADO
                                    TipoPersonal.find().then((tp) => {
                                      tipo_personal = tp;
                                      let proyecto_filter = proyectosA.filter((p) => {
                                        return p.codigo.toLowerCase() === proyectoGong.codigo.toLowerCase();
                                      });
                                      if (proyecto_filter.length > 0) {
                                        return res.status(404).json({ error:"El proyecto seleccionado ya ha sido importado anteriormente!"});
                                      }
                                      setPaises(proyecto, proyectoGong, empresa).then((paises) => {
                                        proyecto.pais = paises;
                                        let paises_filter = paises.filter((pais) => {
                                          return pais.valor.toLowerCase() !== "españa";
                                        });
                                        setDatosGenerales(proyecto, proyectoGong, empresa, paises_filter[0]).then((e) => {
                                          
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
                                          proyecto.gestor = gestorProyecto;
                                          proyecto.implementador = sociosArray;
                                          proyecto.financiador = financiadorArray;
                                          setMatrizSeguimiento(proyecto, matrizGong, proyecto_id, empresa).then((e) => {
                                            proyecto.actividad_global = actividadGlobalProyecto;
                                            setPersonal(personal, proyecto, empresa);
                                            setTesoreria(cuentas_bancarias, proyecto, empresa);
                                            console.log(proyecto);
                                            // return res.json(JSON.parse(api_res.body).proyecto);
                                            proyecto.save().then((proyecto) => {
                                              console.log("exportado");
                                              return res.json(proyecto);
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
                  }).catch((err) => {
                    console.log(err);
                  });
                }).catch((err) => {
                  console.log(err);
                });
              }).catch((err) => {
                console.log(err);
              });




                });
              });
            });
          });
        });
      });
    });
  });
}

function setTesoreria(cuentas_bancarias, proyecto, empresa) {
    cuentas_bancarias.forEach(cuenta => {
    const element = cuenta.cuenta;

    let paises_filter = paisesA.filter((pais) => {
      return pais.valor.toLowerCase() === element.pais.toLowerCase();
    });
    let moneda = monedasA.filter((item) => {
      return item.codigo.toLowerCase() === element.moneda_abreviatura.toLowerCase();
    });
    let localizacion = localizacionA.filter((item) => {
      return item.valor.toLowerCase() === "exterior";
    });
    let nombre = element.nombre;
    if (element.entidad && element.entidad != "") {
      nombre = element.entidad;
    }

    const cuentaB = new CuentaBancaria({
      proyecto: proyecto._id,
      pais: paises_filter[0],
      entidad: nombre,
      moneda: moneda[0],
      ncuenta: element.cuenta,
      localizacion: localizacion[0]
    });
    if (element.cuenta != "") {
      cuentaB.save().then(i => {
        console.log(i);
      }).catch((err) => {
        console.log(err);
      });
    }
  });
}
function setPersonal(personal, proyecto, empresa) {
  personal.forEach(pers => {
    const element = pers.persona;

    let contrato = contratosA.filter((cont) => {
      return cont.valor.toLowerCase() === element.tipo_contrato.toLowerCase();
    });

    if (contrato.length > 0) {
      contrato = contrato[0];
    }else{
      const contra = new Contrato({
        empresa: empresa,
        valor: element.tipo_contrato
      });
      contra.save().then((i) => {
        console.log(i);
      }).catch((err) => {
        console.log(err);
      });
      contrato = contra;
      contratosA.push(contra);
    }

    let categoria = categoriasA.filter((categ) => {
      return categ.valor.toLowerCase() === element.categoria.toLowerCase();
    });

    if (categoria.length > 0) {
      categoria = categoria[0];
    } else {
      let categoriaN;
      if (element.categoria == "") {
        categoriaN = "EMPLEADO"
      }else{
        categoriaN = element.categoria;
      }
      const existe = categoriasA.filter((categ) => {
        return categ.valor.toLowerCase() === categoriaN.toLowerCase();
      });
      if (existe.length > 0) {
        categoria = existe[0];
      } else {
        const categ = new Categoria({
          empresa: empresa,
          valor: categoriaN
        });
        categ.save().then((i) => {
          console.log(i);
        }).catch((err) => {
          console.log(err);
        });
        
        categoria = categ;
        categoriasA.push(categ);
      }
    }

    let tipoP = tipo_personal.filter((tp) => {
      return tp.codigo.toLowerCase() === element.tipo.toLowerCase();
    });

    if (tipoP.length > 0) {
      tipoP = tipoP[0];
    } else {
      const tp = new TipoPersonal({
        codigo: element.tipo,
        valor: element.tipo
      });
      tp.save().then((i) => {
        console.log(i);
      }).catch((err) => {
        console.log(err);
      });
      tipoP = tp;
      tipo_personal.push(tp);
    }

    const persona = new Persona({
      nombre: element.nombre,
      categoria: categoria,
      residencia: element.residencia,
      contrato: contrato,
      horas_imputadas: element.horas_imputadas,
      salario_mensual: element.salario_mensual,
      salario_total: element.salario_total,
      meses: element.meses,
      tipo_personal: tipoP,
      proyecto: proyecto._id
    });
    persona.save().then((i) => {
      console.log(i);
    }).catch((err) => {
      console.log(err);
    });
  });
}

async function setMatrizSeguimiento(proyecto, matrizGong, proyecto_id, empresa) {
  const matriz = matrizGong;
  for (const key in matriz) {
    promises.push(new Promise((resolve, reject) => {
      if (key == "objetivo_general") {
        const objetivoGeneral = new Objetivo({
          codigo: "O.G",
          descripcion: matriz[key].descripcion,
          general: true,
          proyecto: proyecto._id
        });
        objetivoGeneral.save().then((i) => {
          setIndicadores(matriz[key].indicador, i, "objetivo", proyecto);
          setHipotesis(matriz[key].hipotesis, i, "objetivo", proyecto);
          resolve(i);
        }).catch((err) => {
          console.log(err);
        });
      } else if (key == "objetivo_especifico") {
        for (let index = 0; index < matriz[key].length; index++) {
          const element = matriz[key][index].objetivo_especifico;
          const objetivoEspecifico = new Objetivo({
            codigo: element.codigo,
            descripcion: element.descripcion,
            general: false,
            proyecto: proyecto._id
          });
          objetivoEspecifico.save().then((i) => {
            setIndicadores(element.indicador, i, "objetivo", proyecto);
            setHipotesis(element.hipotesis, i, "objetivo", proyecto);
            setComentarios(element.comentarios, i, "objetivo", proyecto);
            setResultados(element.resultado, i, "objetivo", proyecto);
            resolve(i);
          }).catch((err) => {
            console.log(err);
          });
        }
      } else if (key == "actividad") {
        const element = matriz[key][0].actividad;
        const actividad_global = new Actividad({
          codigo: element.codigo,
          descripcion: element.descripcion,
          etapa : new Etapa(null),
          resultado: new Resultado(null)
        });
        actividad_global.save().then((i) => {
          actividadGlobalProyecto = i;
          resolve(i);
        }).catch((err) => {
          console.log(err);
        });
      }
    }));
  }
  return await Promise.all(promises);
}

function setResultados(resultado, objetivo, tipo, proyecto){
  resultado.forEach(res => {
    const element = res.resultado;

    const resultado = new Resultado({
      codigo: element.codigo,
      descripcion: element.descripcion,
      [tipo]: objetivo._id
    });
    resultado.save().then((i) => {
      console.log(i);
      setIndicadores(element.indicador, i, "resultado", proyecto);
      setHipotesis(element.hipotesis, i, "resultado", proyecto);
      setComentarios(element.comentarios, i, "resultado", proyecto);
      setActividades(element.actividad, i, "resultado", proyecto);
    }).catch((err) => {
      console.log(err);
    });
  });
}

function setActividades(actividad, resultado, tipo, proyecto) {
  actividad.forEach(act => {
    const element = act.actividad;
    const actividad = new Actividad({
      codigo: element.codigo,
      descripcion: element.descripcion,
      [tipo]: resultado._id,
      etapa: new Etapa(null)
    });
    actividad.save().then((i) => {
      console.log(i);
    }).catch((err) => {
      console.log(err);
    });
  });
}

function setIndicadores(indicador, objetivoResultado, tipo, proyecto){
  indicador.forEach(ind => {
    const element = ind.indicador;
    let indicador = new Indicador();
    let indicador_linea = 0;
    let indicador_meta = 0;

    if (element.variable && element.variable.length > 0) {
      indicador_linea = element.variable[0].variable_indicador.linea_base;
      indicador_meta = element.variable[0].variable_indicador.meta_final;
    }

    indicador.codigo = element.codigo;
    indicador.descripcion = element.descripcion;
    indicador.linea_base = indicador_linea;
    indicador[tipo] = objetivoResultado._id;
    indicador.meta = indicador_meta;

    indicador.save().then(indicador => {
      indicadoresObj.push(indicador);
      setFuentesVerificacion(element.fuente_verificacion, indicador);
      setComentarios(element.comentario, indicador, "indicador", proyecto);
      console.log(indicador);
    }).catch((err) => {
      console.log(err)
    });
  });
}

function setFuentesVerificacion(fuente_verificacion, indicador){
  fuente_verificacion.forEach(fuente => {
    const element = fuente.fuente_verificacion;
    const fuenteV = new FuenteVerificacion({
      codigo: element.codigo,
      descripcion: element.descripcion,
      indicador: indicador._id
    });
    fuenteV.save().then(i => {
      console.log(i);
    }).catch((err) => {
      console.log(err)
    });
  });
}
function setHipotesis(hipotesis, objetivoResultado, tipo,  proyecto){
  hipotesis.forEach(hipo => {
    const element = hipo.hipotesis;
    const Hipo = new Hipotesis({
      descripcion: element.descripcion,
      [tipo]: objetivoResultado._id
    });
    Hipo.save().then(i => {
      console.log(i);
    }).catch((err) => {
      console.log(err)
    });
  });
}
function setComentarios(comentarios, objetivoResultado, tipo, proyecto){
  comentarios.forEach(com => {
    const element = com.comentario;
    let fecha;
    if (tipo == "indicador") {
      fecha = element.fecha;
    } else {
      fecha = element.created_at;
    }
    const comentario = new Comentario({
      texto: element.texto,
      [tipo]: objetivoResultado._id,
      fecha: fecha
    });
    comentario.save().then(i => {
      console.log(i);
    }).catch((err) => {
      console.log(err)
    });
  });
}

async function setPaises(proyecto, gong, empresa) {
  const paises = gong.pais.split(",");
  const paisesArray = [];
  const moneda = monedasA.filter((item) => {
    return item.codigo.toLowerCase() === gong.moneda_base.toLowerCase();
  });
  paises.forEach(p => {
    paises_project_promise.push(new Promise((resolve, reject) => {
      if (paisesA && paisesA.length > 0) {
        let paises_filter = paisesA.filter((pais) => {
          return pais.valor.toLowerCase() === p.toLowerCase();
        });
        if (paises_filter && paises_filter.length > 0) {
          paisesArray.push(paises_filter[0]);
          resolve(paises_filter[0]);
        } else {
          const pais = new Pais({
            empresa: empresa,
            valor: p,
            moneda: moneda[0]
          });
          pais.save().then((pais) => {
            paisesArray.push(pais);
            resolve(pais);
          }).catch((err) => {
            console.log(err);
          });
        }
      } else {
        const pais = new Pais({
          empresa: empresa,
          valor: p,
          moneda: moneda[0]
        });
        pais.save().then((pais) => {
          paisesArray.push(pais);
          resolve(pais);
        }).catch((err) => {
          console.log(err);
        });
      }
    }));
  });
  return await Promise.all(paises_project_promise);
}

async function setDatosGenerales(proyecto, gong, empresa, pais) {
  for (const key in gong) {
    if (key == "gestor") {
      promises.push(new Promise((resolve, reject) => {
        const implementadores_filter = implementadoresA.filter((item) => {
          return item.nombre.toLowerCase() === gong[key].toLowerCase();
        });
        if (implementadores_filter && implementadores_filter.length > 0) {
          gestorProyecto = implementadores_filter[0];
          resolve(implementadores_filter[0]);
        } else {
          let gestor = new Implementador({
            empresa: empresa,
            nombre: gong[key],
            implementador: true,
            descripcion: gong[key],
            financiador: false,
            socio_local: false,
            publico: true,
            pais: pais
          });
          gestor.save().then((i) => {
            console.log(JSON.stringify(i));
            gestorProyecto = i;
            resolve(i);
          }).catch((err) => {
            console.log(err);
          });
        }
      }));
    } else if (key == "socio_local") {
      promises.push(new Promise((resolve, reject) => {
        const socios = gong[key].split(",");
        socios.forEach(element => {
          const socios_filter = implementadoresA.filter((item) => {
            return item.nombre.toLowerCase() === element.toLowerCase();
          });
          if (socios_filter && socios_filter.length > 0) {
            sociosArray.push(socios_filter[0]);
            resolve(socios_filter[0]._id);
          } else {
            let socio = new Implementador({
              empresa: empresa,
              nombre: element,
              descripcion: element,
              implementador: true,
              financiador: false,
              socio_local: true,
              publico: true,
              pais: pais
            });
            socio.save().then((i) => {
              console.log(JSON.stringify(i));
              sociosArray.push(i);
              resolve(i);
            }).catch((err) => {
              console.log(err);
            });
          }
      });
    }));
    }
  }
  return await Promise.all(promises);
}