const router = require('express').Router();
//Controladores
const proyecto = require('./proyecto.route');
const documentos = require('./documentos.route');
const excel_export = require('./excel_export.route');
const etapa = require('./etapa.route');
const validacion = require('./validacion.route');
const presupuesto = require('./presupuesto.route');
const objetivo = require('./objetivo/objetivo.route');
const objetivo_indicadores = require('./objetivo/indicadores/indicadores.route');
const objetivo_indicador_comentarios = require('./objetivo/indicadores/comentarios/comentarios.route');
const objetivo_indicadores_progreso = require('./objetivo/indicadores/indicadores_progreso.route');
const objetivo_indicadores_medida = require('./objetivo/indicadores/medidas/medida.route');
const objetivo_fuentes_verificacion = require('./objetivo/indicadores/fuentes_verificacion/fuentes_verificacion.route');
const objetivo_fuentes_verificacion_documentos = require('./objetivo/indicadores/fuentes_verificacion/documentos/documento.route');
const actividad_global = require('./actividad_global/actividad_global.route');
const aportacion = require('./aportacion.route');
const bien = require('./bien.route');
const cuenta_bancaria = require('./cuentas_bancarias/cuenta_bancaria.route');
const cuenta_bancaria_operacion_bancaria = require('./cuentas_bancarias/operaciones_bancarias/operacion_bancaria.route');
const entidad = require('./entidad.route');
const gasto = require('./gastos/gasto.route');
const pago = require('./gastos/pagos/pago.route');
const gasto_partida = require('./gastos/gasto_partida.route');
const gasto_documentos = require('./gastos/documentos/documento.route');
const importe = require('./importe/importe.route');
const importe_detalle_importe = require('./importe/importe_detalle_importe.route');
const modificacion = require('./modificacion.route');
const partida = require('./partida.route');
const persona = require('./persona.route');
const objetivos_especificos = require('./objetivos_especificos/objetivos_especificos.route');
const objetivos_especificos_hipotesis = require('./objetivos_especificos/hipotesis/hipotesis.route');
const objetivos_especificos_comentarios = require('./objetivos_especificos/comentarios/comentarios.route');
const objetivos_especificos_resultados = require('./objetivos_especificos/resultados/resultado.route');
const objetivos_especificos_resultados_hipotesis = require('./objetivos_especificos/resultados/hipotesis/hipotesis.route');
const objetivos_especificos_resultados_indicador = require('./objetivos_especificos/resultados/indicadores/indicadores.route');
const objetivos_especificos_resultados_indicador_medida = require('./objetivos_especificos/resultados/indicadores/medidas/medida.route');
const objetivos_especificos_resultados_indicador_comentarios = require('./objetivos_especificos/resultados/indicadores/comentarios/comentarios.route');
const objetivos_especificos_resultados_medida = require('./objetivos_especificos/indicadores/medidas/medida.route');
const objetivos_especificos_resultados_fuentes_verificacion = require('./objetivos_especificos/resultados/indicadores/fuentes_verificacion/fuentes_verificacion.route');
const objetivos_especificos_indicadores_fuentes_verificacion_documentos = require('./objetivos_especificos/indicadores/fuentes_verificacion/documentos/documento.route');
const objetivos_especificos_resultados_actividad = require('./objetivos_especificos/resultados/actividades/actividad.route');
const objetivos_especificos_resultados_actividad_comentarios = require('./objetivos_especificos/resultados/actividades/comentarios/comentarios.route');
const objetivos_especificos_resultados_actividad_progreso = require('./objetivos_especificos/resultados/actividades/actividad_progreso.route');
const objetivos_especificos_resultados_comentarios = require('./objetivos_especificos/resultados/comentarios/comentarios.route');
const objetivos_especificos_resultados_actividad_planificacion = require('./objetivos_especificos/resultados/actividades/actividad_planificacion.route');
const objetivos_especificos_resultados_actividad_ejecucion = require('./objetivos_especificos/resultados/actividades/actividad_ejecucion.route');
const objetivos_especificos_resultados_actividad_recursos = require('./objetivos_especificos/resultados/actividades/recursos/recursos.route');
const objetivos_especificos_resultados_indicador_progreso = require('./objetivos_especificos/resultados/indicadores/indicadores_progreso.route');
const objetivos_especificos_resultados_indicadores_fuentes_verificacion_documentos = require('./objetivos_especificos/resultados/indicadores/fuentes_verificacion/documentos/documento.route');
const objetivos_especificos_indicador = require('./objetivos_especificos/indicadores/indicadores.route');
const objetivos_especificos_indicador_comentarios = require('./objetivos_especificos/indicadores/comentarios/comentarios.route');
const objetivos_especificos_fuentes_verificacion = require('./objetivos_especificos/indicadores/fuentes_verificacion/fuentes_verificacion.route');
const objetivos_especificos_indicador_progreso = require('./objetivos_especificos/indicadores/indicadores_progreso.route');
const actividad_global_progreso = require('./actividad_global/actividad_global_progreso.route');
const actividad_global_recursos = require('./actividad_global/recursos/recursos.route');
const periodo = require('./periodo.route');
const informe = require('./informe.route');

//Rutas
router.use(proyecto);
router.use(documentos);
router.use(excel_export);
router.use(validacion);
router.use(etapa);
router.use(presupuesto);
router.use(objetivo);
router.use(objetivo_indicadores);
router.use(objetivo_indicador_comentarios);
router.use(objetivo_indicadores_progreso);
router.use(objetivo_indicadores_medida);
router.use(objetivo_fuentes_verificacion);
router.use(objetivo_fuentes_verificacion_documentos);
router.use(actividad_global);
router.use(actividad_global_progreso);
router.use(actividad_global_recursos);
router.use(aportacion);
router.use(bien);
router.use(cuenta_bancaria);
router.use(cuenta_bancaria_operacion_bancaria);
router.use(entidad);
router.use(gasto);
router.use(pago);
router.use(gasto_partida);
router.use(gasto_documentos);
router.use(importe);
router.use(importe_detalle_importe);
router.use(modificacion);
router.use(partida);
router.use(persona);
router.use(objetivos_especificos);
router.use(objetivos_especificos_hipotesis);
router.use(objetivos_especificos_comentarios);
router.use(objetivos_especificos_resultados);
router.use(objetivos_especificos_resultados_medida);
router.use(objetivos_especificos_fuentes_verificacion);
router.use(objetivos_especificos_indicadores_fuentes_verificacion_documentos);
router.use(objetivos_especificos_resultados_indicadores_fuentes_verificacion_documentos);
router.use(objetivos_especificos_resultados_actividad);
router.use(objetivos_especificos_resultados_comentarios);
router.use(objetivos_especificos_resultados_actividad_progreso);
router.use(objetivos_especificos_resultados_actividad_comentarios);
router.use(objetivos_especificos_resultados_actividad_planificacion);
router.use(objetivos_especificos_resultados_actividad_ejecucion);
router.use(objetivos_especificos_resultados_actividad_recursos);
router.use(objetivos_especificos_resultados_hipotesis);
router.use(objetivos_especificos_resultados_fuentes_verificacion);
router.use(objetivos_especificos_resultados_indicador);
router.use(objetivos_especificos_resultados_indicador_progreso);
router.use(objetivos_especificos_resultados_indicador_medida);
router.use(objetivos_especificos_resultados_indicador_comentarios);
router.use(objetivos_especificos_indicador);
router.use(objetivos_especificos_indicador_comentarios);
router.use(objetivos_especificos_indicador_progreso);
router.use(periodo);
router.use(informe);

let route, routes = [];

router.stack.forEach(function(middleware){
    if(middleware.route){ // routes registered directly on the app
        routes.push(middleware.route);
    } else if(middleware.name === 'router'){ // router middleware 
        middleware.handle.stack.forEach(function(handler){
            route = handler.route;
            route && routes.push(route);
        });
    }
});

routes.forEach(function(temp){
	let methods = "";
	for(var method in temp.methods){
		methods += method + ", ";
	}
	console.log(temp.path + ": " + methods);
});

module.exports = router;
