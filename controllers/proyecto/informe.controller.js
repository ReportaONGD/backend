const mongoose = require('mongoose');
const Informe = mongoose.model('Informe');
const Periodo = mongoose.model('Periodo');
const Proyecto = mongoose.model('Proyecto');
const Etapa = mongoose.model('Etapa');
const Modificacion = mongoose.model('Modificacion');
// const CuentaBancaria = mongoose.model('CuentaBancaria');
const Partida = mongoose.model('Partida');
const Persona = mongoose.model('Persona');
const Presupuesto = mongoose.model('Presupuesto');
// const Indicador = mongoose.model('Indicador');
const FuenteVerificacion = mongoose.model('FuenteVerificacion');
const CuentaBancaria = mongoose.model('CuentaBancaria');
const OperacionBancaria = mongoose.model('OperacionBancaria');
const Gasto = mongoose.model('Gasto');
const Pago = mongoose.model('Pago');
const Objetivo = mongoose.model('Objetivo');
const Indicador = mongoose.model('Indicador');
const Medida = mongoose.model('Medida');
const Hipotesis = mongoose.model('Hipotesis');
const Resultado = mongoose.model('Resultado');
const Actividad = mongoose.model('Actividad');


const utils = require('../../utils/binding');
// const moment = require('moment');
const async = require('async');

//Esta variable contendra el mapeo por cada entidad necesaria
//del id antiguo y el nuevo. Por ejemplo ->
// {
//  cuenta: 
//    {
//      "019239272032039093":"89734907398470948"
//    },
//  etapa: 
//    {
//      "333239272032039093":"2239734907398470948"
//    } 
// }
let objIds = {};

exports.findAll = function (req, res, next) {
  let informes = req.proyecto.informes || [];

  return res.json(informes);
};

exports.create = function (req, res, next) {
  if (!req.body) {
    return res.sendStatus(404);
  }

  let proyecto = req.proyecto;
  let informe = new Informe(req.body);

  this.objIds = {};
  objIds = {};

  async.waterfall([
    async.apply(cloneProyecto, proyecto),
      async.apply(cloneElementosProyecto, 'modificaciones', Modificacion),
        async.apply(cloneElementosProyecto, 'etapas', Etapa),
          async.apply(cloneElementosProyecto, 'periodos', Periodo),
            async.apply(cloneElementosProyecto, 'cuentas_bancarias', CuentaBancaria),
              async.apply(cloneElementosProyecto, 'personal', Persona),
                clonePresupuestos,
                cloneOperacionesBancarias,
                cloneObjetivosGenerales,
                cloneIndicadores,
                cloneFuentesVerificacion,
                cloneMedidas,
                cloneObjetivosEspecificos,
                cloneHipotesis,
                cloneResultados,
                cloneActividades,
                cloneHipotesisResultado,
                cloneIndicadoresResultado,
                cloneFuentesVerificacionResultado,
                cloneMedidasResultado,
                cloneIndicadores,
                cloneFuentesVerificacion,
                cloneMedidas,
                cloneGastos,
                clonePagos
  ], function (err, proyecto, proyecto_clone) {
    if (err) return console.error(err);

    informe.proyecto = proyecto.id;
    informe.proyecto_padre_id = proyecto_clone.id;

    informe.save(function () {
      return res.json(req.body);
    });
  });
};

exports.get = function (req, res, next) {
  if (!req.params.id) {
    return res.sendStatus(404);
  }
  Informe.findById(req.params.id).then(function (informe) {
    return res.json(informe);
  });
};

exports.update = function (req, res, next) {
  if (!req.body) {
    return res.sendStatus(404);
  }
  Informe.findByIdAndUpdate(req.params.id, req.body).then(function (informe) {
    return res.json(req.body);
  });
};

exports.delete = function (req, res, next) {
  if (!req.params.id) {
    return res.sendStatus(404);
  }

  Informe.findByIdAndRemove(req.params.id).then(function () {
    return res.json({
      message: req.t('% Deleted Correctly', req.t('models.informe'))
    });
  }).catch(next);
};

function cloneProyecto(proyecto, callback) {
  let proyecto_clone = new Proyecto();
  utils.bindingObject2(proyecto, proyecto_clone);
  proyecto_clone.proyecto_padre = proyecto.id;
  proyecto_clone.readonly = true;
  proyecto_clone.actividad_global = proyecto.actividad_global;

  proyecto_clone.save(function (err, proyecto_clone) {
    if (err) return console.error(err);
    return callback(null, proyecto, proyecto_clone);
  });
}

function cloneElementosProyecto(element_array, clase, proyecto, proyecto_clone, callback) {
  //Si esta vacio el array hay que llamar al callback
  //Para que continue.
  if (proyecto[element_array].length === 0)
    return callback(null, proyecto, proyecto_clone);

  proyecto[element_array].forEach(function (element) {
    let element_clone = new clase();
    utils.bindingObject2(element, element_clone);
    element_clone.proyecto = proyecto_clone._id;

    element_clone.save(function (err, element_clone) {
      if (err) return console.error(err);

      setObjIds(element_array, element.id, element_clone.id);
      if (Object.keys(objIds[element_array]).length === proyecto[element_array].length)
        return callback(null, proyecto, proyecto_clone);
    });
  });
}

function clonePresupuestos(proyecto, proyecto_clone, callback) {
  if (proyecto.presupuestos.length === 0)
    return callback(null, proyecto, proyecto_clone);

  let contador = 0;
  proyecto.presupuestos.forEach(function (presupuesto) {
    let presupuesto_clone = new Presupuesto();
    utils.bindingObject2(presupuesto, presupuesto_clone);
    presupuesto_clone.etapa = objIds.etapas[presupuesto.etapa.id];
    presupuesto_clone.partida = presupuesto.partida.id;
    presupuesto_clone.proyecto = proyecto_clone._id;

    presupuesto_clone.save(function (err, presupuesto_clone) {
      if (err) return console.error(err);
      contador++;
      if (contador === proyecto.presupuestos.length)
        return callback(null, proyecto, proyecto_clone);
    });
  });
}

function cloneOperacionesBancarias(proyecto, proyecto_clone, callback) {
  if (proyecto.operaciones_bancarias.length === 0)
    return callback(null, proyecto, proyecto_clone);

  proyecto.operaciones_bancarias.forEach(function (operacion_bancaria) {
    let operaciones_bancaria_clone = new OperacionBancaria();
    utils.bindingObject2(operacion_bancaria, operaciones_bancaria_clone);
    operaciones_bancaria_clone.proyecto = proyecto_clone._id;
    operaciones_bancaria_clone.cuenta_origen = objIds.cuentas_bancarias[operacion_bancaria.cuenta_origen.id];
    operaciones_bancaria_clone.cuenta_destino = objIds.cuentas_bancarias[(operacion_bancaria.cuenta_destino ? operacion_bancaria.cuenta_destino.id : null)];

    operaciones_bancaria_clone.save(function (err, operacion_bancaria_clone) {
      if (err) return console.error(err);

      setObjIds('operaciones_bancarias', operacion_bancaria.id, operacion_bancaria_clone.id);
      if (Object.keys(objIds.operaciones_bancarias).length === proyecto.operaciones_bancarias.length)
        return callback(null, proyecto, proyecto_clone);
    });
  });
}

function cloneIndicadores(proyecto, proyecto_clone, indicadores, callback) {
  if (indicadores.length === 0)
    return callback(null, proyecto, proyecto_clone, [], []);

  let fuentes_array = [];
  let medidas_array = [];
  indicadores.forEach(function (indicador) {
    let indicador_clone = new Indicador();
    utils.bindingObject2(indicador, indicador_clone);
    indicador_clone.objetivo = objIds.objetivos[indicador.objetivo];

    if (indicador.fuente_verificacion && indicador.fuente_verificacion.length > 0)
      fuentes_array = fuentes_array.concat(indicador.fuente_verificacion);

    if (indicador.medida && indicador.medida.length > 0)
      medidas_array = medidas_array.concat(indicador.medida);

    indicador_clone.save(function (err, indicador_clone) {
      if (err) return console.error(err);

      setObjIds('indicadores', indicador.id, indicador_clone.id);
      if (Object.keys(objIds.indicadores).length === indicadores.length)
        return callback(null, proyecto, proyecto_clone, fuentes_array, medidas_array);
    });
  });
}

function cloneFuentesVerificacion(proyecto, proyecto_clone, fuentes, medidas, callback) {
  objIds.fuentes = {};
  if (fuentes.length === 0)
    return callback(null, proyecto, proyecto_clone, medidas);

  fuentes.forEach(function (fuente) {
    let fuente_clone = new FuenteVerificacion();
    utils.bindingObject2(fuente, fuente_clone);
    fuente_clone.indicador = objIds.indicadores[fuente.indicador];

    fuente_clone.save(function (err, fuente_clone) {
      if (err) return console.error(err);

      setObjIds('fuentes', fuente.id, fuente_clone.id);
      if (Object.keys(objIds.fuentes).length === fuentes.length)
        return callback(null, proyecto, proyecto_clone, medidas);
    });
  });
}

function cloneMedidas(proyecto, proyecto_clone, medidas, callback) {
  if (medidas.length === 0)
    return callback(null, proyecto, proyecto_clone);

  medidas.forEach(function (medida) {
    let medida_clone = new Medida();
    utils.bindingObject2(medida, medida_clone);
    medida_clone.indicador = objIds.indicadores[medida.indicador];

    medida_clone.save(function (err, medida_clone) {
      if (err) return console.error(err);

      setObjIds('medidas', medida.id, medida_clone.id);
      if (Object.keys(objIds.medidas).length === medidas.length)
        return callback(null, proyecto, proyecto_clone);
    });
  });
}

function cloneObjetivosEspecificos(proyecto, proyecto_clone, callback) {
  if (proyecto.objetivos_especificos.length === 0)
    return callback(null, proyecto, proyecto_clone, [], [], []);

  //Eliminamos los datos de la rama de objetivos 
  //se esta usando este mismo nombre para poder reutilizar las mismas funciones
  //en Generales y Especificos.
  removeObjIds('objetivos');

  let indicadores_array = [];
  let hipotesis_array = [];
  let resultados_array = [];

  proyecto.objetivos_especificos.forEach(function (objetivo_especifico) {
    let objetivo_especifico_clone = new Objetivo();
    utils.bindingObject2(objetivo_especifico, objetivo_especifico_clone);
    objetivo_especifico_clone.proyecto = proyecto_clone._id;
    objetivo_especifico_clone.general = false;
    if (objetivo_especifico.indicadores && objetivo_especifico.indicadores.length > 0)
      indicadores_array = indicadores_array.concat(objetivo_especifico.indicadores);

    if (objetivo_especifico.hipotesis && objetivo_especifico.hipotesis.length > 0)
      hipotesis_array = hipotesis_array.concat(objetivo_especifico.hipotesis);

    if (objetivo_especifico.resultados && objetivo_especifico.resultados.length > 0)
      resultados_array = resultados_array.concat(objetivo_especifico.resultados);

    objetivo_especifico_clone.save(function (err, objetivo_especifico_clone) {
      if (err) return console.error(err);

      setObjIds('objetivos', objetivo_especifico.id, objetivo_especifico_clone.id);
      if (Object.keys(objIds.objetivos).length === proyecto.objetivos_especificos.length)
        return callback(null, proyecto, proyecto_clone, indicadores_array, hipotesis_array, resultados_array);
    });
  });
}

function cloneObjetivosGenerales(proyecto, proyecto_clone, callback) {
  let objetivo_general = proyecto.objetivo;

  if (objetivo_general === null)
  {
    return callback(null, proyecto, proyecto_clone, []);
  }

  let indicadores_array = [];
  // let medidas_array = [];
  // let resultados_array = [];

  let objetivo_general_clone = new Objetivo();
  utils.bindingObject2(objetivo_general, objetivo_general_clone);
  objetivo_general_clone.proyecto = proyecto_clone._id;
  indicadores_array = indicadores_array.concat(objetivo_general.indicadores);
  // medidas_array = medidas_array.concat(objetivo_general.medidas);
  // resultados_array = resultados_array.concat(gasto.pagos);

  objetivo_general_clone.save(function (err, objetivo_general_clone) {
    if (err) return console.error(err);

    setObjIds('objetivos', objetivo_general.id, objetivo_general_clone.id);
    // return callback(null, proyecto, proyecto_clone, indicadores_array, medidas_array);
    return callback(null, proyecto, proyecto_clone, indicadores_array);
  });
}

//Para grabar los gastos hacen falta las actividades
function cloneGastos(proyecto, proyecto_clone, callback) {
  if (proyecto.gastos.length === 0)
    return callback(null, proyecto, proyecto_clone, []);

  let contador = 0;
  let pagos_array = [];
  proyecto.gastos.forEach(function (gasto) {
    let gasto_clone = new Gasto();
    utils.bindingObject2(gasto, gasto_clone);
    gasto_clone.proyecto = proyecto_clone._id;
    gasto_clone.partida = gasto.partida.id;
    gasto_clone.actividad = objIds.actividades[gasto.actividad.id];
    pagos_array = pagos_array.concat(gasto.pagos);
    gasto_clone.save(function (err, gasto_clone) {
      if (err) return console.error(err);

      contador++;
      setObjIds('gastos', gasto.id, gasto_clone.id);
      if (contador === proyecto.gastos.length)
        return callback(null, proyecto, proyecto_clone, pagos_array);
    });
  });
}

function cloneHipotesis(proyecto, proyecto_clone, indicadores, hipotesis, resultados, callback) {
  if (hipotesis.length === 0)
    return callback(null, proyecto, proyecto_clone, indicadores, resultados);

  let contador = 0;

  hipotesis.forEach(function (hipo) {
    let hipo_clone = new Hipotesis();
    utils.bindingObject2(hipo, hipo_clone);
    hipo_clone.objetivo = objIds.objetivos[hipo_clone.objetivo];

    hipo_clone.save(function (err, hipo_clone) {
      if (err) return console.error(err);

      contador++;
      setObjIds('hipotesis', hipo.id, hipo_clone.id);
      if (contador === hipotesis.length)
        return callback(null, proyecto, proyecto_clone, indicadores, resultados);
      // return callback(null, proyecto, proyecto_clone);
    });
  });
}

function cloneResultados(proyecto, proyecto_clone, indicadores, resultados, callback) {
  if (resultados.length === 0)
    return callback(null, proyecto, proyecto_clone, indicadores,  [], [], []);

  let contador = 0;
  let indicadores_array = [];
  let actividades_array = [];
  let hipotesis_array = [];

  resultados.forEach(function (resultado) {
    let resultado_clone = new Resultado();
    utils.bindingObject2(resultado, resultado_clone);
    resultado_clone.objetivo = objIds.objetivos[resultado_clone.objetivo];
    indicadores_array = indicadores_array.concat(resultado.indicadores);
    hipotesis_array = hipotesis_array.concat(resultado.hipotesis);
    actividades_array = actividades_array.concat(resultado.actividades);

    resultado_clone.save(function (err, resultado_clone) {
      if (err) return console.error(err);

      contador++;
      setObjIds('resultados', resultado.id, resultado_clone.id);
      if (contador === resultados.length)
        // return callback(null, proyecto, proyecto_clone, indicadores, resultados);
        return callback(null, proyecto, proyecto_clone, indicadores, actividades_array, hipotesis_array, indicadores_array);
    });
  });
}

function cloneActividades(proyecto, proyecto_clone, indicadores_objetivo, actividades, hipotesis, indicadores_resultado, callback) {
  if (actividades.length === 0)
    return callback(null, proyecto, proyecto_clone, indicadores_objetivo, hipotesis, indicadores_resultado);

  let contador = 0;

  actividades.forEach(function (actividad) {
    let actividad_clone = new Actividad();
    utils.bindingObject2(actividad, actividad_clone);
    actividad_clone.resultado = objIds.resultados[actividad_clone.resultado];

    actividad_clone.save(function (err, actividad_clone) {
      if (err) return console.error(err);

      contador++;
      setObjIds('actividades', actividad.id, actividad_clone.id);
      if (contador === actividades.length)
        return callback(null, proyecto, proyecto_clone, indicadores_objetivo, hipotesis, indicadores_resultado);
    });
  });
}

function cloneHipotesisResultado(proyecto, proyecto_clone, indicadores_objetivo, hipotesis, indicadores_resultado, callback) {
  if (hipotesis.length === 0)
    return callback(null, proyecto, proyecto_clone, indicadores_objetivo, indicadores_resultado);

  let contador = 0;

  hipotesis.forEach(function (hipo) {
    let hipo_clone = new Hipotesis();
    utils.bindingObject2(hipo, hipo_clone);
    hipo_clone.resultado = objIds.resultados[hipo.resultado];

    hipo_clone.save(function (err, hipo_clone) {
      if (err) return console.error(err);

      contador++;
      setObjIds('hipotesis', hipo.id, hipo_clone.id);
      if (contador === hipotesis.length)
        return callback(null, proyecto, proyecto_clone, indicadores_objetivo, indicadores_resultado);
      // return callback(null, proyecto, proyecto_clone);
    });
  });
}

function cloneIndicadoresResultado(proyecto, proyecto_clone, indicadores_objetivo, indicadores_resultado, callback) {
  if (indicadores_resultado.length === 0)
    return callback(null, proyecto, proyecto_clone, indicadores_objetivo, [], []);

  let fuentes_array = [];
  let medidas_array = [];
  indicadores_resultado.forEach(function (indicador) {
    let indicador_clone = new Indicador();
    utils.bindingObject2(indicador, indicador_clone);
    indicador_clone.resultado = objIds.resultados[indicador.resultado];

    if (indicador.fuente_verificacion && indicador.fuente_verificacion.length > 0)
      fuentes_array = fuentes_array.concat(indicador.fuente_verificacion);

    if (indicador.medida && indicador.medida.length > 0)
      medidas_array = medidas_array.concat(indicador.medida);

    indicador_clone.save(function (err, indicador_clone) {
      if (err) return console.error(err);

      setObjIds('indicadores_resultado', indicador.id, indicador_clone.id);
      if (Object.keys(objIds.indicadores_resultado).length === indicadores_resultado.length)
        return callback(null, proyecto, proyecto_clone, indicadores_objetivo, fuentes_array, medidas_array);
    });
  });
}

function cloneFuentesVerificacionResultado(proyecto, proyecto_clone, indicadores_objetivo, fuentes, medidas, callback) {
  objIds.fuentes = {};
  if (fuentes.length === 0)
    return callback(null, proyecto, proyecto_clone, indicadores_objetivo, medidas);

  fuentes.forEach(function (fuente) {
    let fuente_clone = new FuenteVerificacion();
    utils.bindingObject2(fuente, fuente_clone);
    fuente_clone.indicador = objIds.indicadores_resultado[fuente.indicador];

    fuente_clone.save(function (err, fuente_clone) {
      if (err) return console.error(err);

      setObjIds('fuentes', fuente.id, fuente_clone.id);
      if (Object.keys(objIds.fuentes).length === fuentes.length)
        return callback(null, proyecto, proyecto_clone, indicadores_objetivo, medidas);
    });
  });
}

function cloneMedidasResultado(proyecto, proyecto_clone, indicadores_objetivo, medidas, callback) {
  //Quitamos los indicadores que hubiera antes
  objIds.indicadores = {};
  if (medidas.length === 0)
    return callback(null, proyecto, proyecto_clone, indicadores_objetivo);


  medidas.forEach(function (medida) {
    let medida_clone = new Medida();
    utils.bindingObject2(medida, medida_clone);
    medida_clone.indicador = objIds.indicadores[medida.indicador];

    medida_clone.save(function (err, medida_clone) {
      if (err) return console.error(err);

      setObjIds('medidas', fuente.id, medida_clone.id);
      if (Object.keys(objIds.medidas).length === medidas.length)
        return callback(null, proyecto, proyecto_clone, indicadores_objetivo);
    });
  });
}

function clonePagos(proyecto, proyecto_clone, pagos, callback) {
  if (pagos.length === 0)
    return callback(null, proyecto, proyecto_clone);


  pagos.forEach(function (pago) {
    let pago_clone = new Pago();
    utils.bindingObject2(pago, pago_clone);
    pago_clone.gasto = objIds.gastos[pago.gasto];
    pago_clone.cuenta_origen = objIds.cuentas_bancarias[pago.cuenta_origen.id];
    pago_clone.cuenta_destino = objIds.cuentas_bancarias[(pago.cuenta_destino ? pago.cuenta_destino.id : null)];

    pago_clone.save(function (err, pago_clone) {
      if (err) return console.error(err);

      setObjIds('pagos', pago.id, pago_clone.id);
      if (Object.keys(objIds.pagos).length === pagos.length)
        return callback(null, proyecto, proyecto_clone);
    });
  });
}

function setObjIds(seccion, valor_original, valor_clonado) {
  if (!objIds[seccion]) {
    objIds[seccion] = {};
  }
  objIds[seccion][valor_original] = valor_clonado;
}

function removeObjIds(seccion) {
  delete objIds[seccion];
}