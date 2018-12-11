/*TODO:  Preguntar si hacemos Importe ejecutado y presupuesto ejecutado ya que la entidad proyecto va a a tener ligado un estado y tiene las entidades importe y partida vinculadas por estado.
TODO: PENDIENTE DE ESTADOS Y DEFINIR QUE DATOS FORMAN PARTE DE ESOS ESTADOS,
 Y CUALES SON INMUTABLES Y REFERENTES AL PROYECTO */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let i18n = require('i18n');
const Actividad = mongoose.model('Actividad').schema;
let EstadosProyecto = mongoose.model('EstadosProyecto');

const ProyectoSchema = new Schema({
  codigo: {
    type: String
  },
  nombre: {
    type: String
  },
  titulo: {
    type: String
  },
  descripcion: {
    type: String
  },
  pais: [{
    type: Schema.ObjectId,
    ref: 'Pais'
  }],
  gestor: {
    type: Schema.ObjectId,
    ref: 'Agente'
  },
  provincia_municipio: {
    type: String
  },
  firma: {
    type: String
  },
  actividad_global: Actividad,
  partida: [{
    type: Schema.ObjectId,
    ref: 'Partida'
  }],
  importe: {
    type: Schema.ObjectId,
    ref: 'Importe'
  },
  aportaciones: [{
    type: Schema.ObjectId,
    ref: 'Aportacion'
  }],
  bienes: [{
    type: Schema.ObjectId,
    ref: 'Bien'
  }],
  presupuesto_ejecutado: {
    type: Schema.ObjectId,
    ref: 'PresupuestoEjecutado'
  }, //Este campo se rellena cuando se active un estado de proyecto, en el alta es null
  importe_ejecutado: {
    type: Schema.ObjectId,
    ref: 'ImporteEjecutado'
  },
  entidades: [{
    type: Schema.ObjectId,
    ref: 'Entidad'
  }],
  empresa: {
    type: Schema.ObjectId,
    ref: 'Empresa',
    required: [true, i18n.__n("can't be blank")]
  },
  estado_proyecto: {
    type: Schema.ObjectId,
    ref: 'EstadosProyecto'
  },
  financiador: [{
    type: Schema.ObjectId,
    ref: 'Agente'
  }],
  implementador: [{
    type: Schema.ObjectId,
    ref: 'Agente'
  }],
  convocatoria: {
    type: Schema.ObjectId,
    ref: 'Convocatoria'
  },
  readonly: {
    type: Boolean,
    // default: false
  },
  proyecto_padre: {
    type: Schema.ObjectId,
    ref: this
  }
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  },
  timestamps: true,
  usePushEach: true
});

ProyectoSchema.pre('save', function (next) {
  const proyecto = this;
  if (this.isNew) {
    // Para encontrar el mas nuevo { 'created_at' : -1 }
    // Para encontrar el mas antiguo { 'created_at' : 1 }
    EstadosProyecto.findOne({}, {}, {
      'created_at': 1
    }).then(function (estado_proyecto) {
      proyecto.estado_proyecto = estado_proyecto;
      next();
    }).catch(next);
  } else {
    next();
  }
});


ProyectoSchema.virtual('informes', {
  ref: 'Informe',
  localField: '_id',
  foreignField: 'proyecto',
  // justOne: true // Only return one owner
});

ProyectoSchema.virtual('presupuestos', {
  ref: 'Presupuesto',
  localField: '_id',
  foreignField: 'proyecto',
  // justOne: true // Only return one owner
});

ProyectoSchema.virtual('personal', {
  ref: 'Persona',
  localField: '_id',
  foreignField: 'proyecto',
  // justOne: true // Only return one owner
});

ProyectoSchema.virtual('operaciones_bancarias', {
  ref: 'OperacionBancaria',
  localField: '_id',
  foreignField: 'proyecto',
  // justOne: true // Only return one owner
});

ProyectoSchema.virtual('cuentas_bancarias', {
  ref: 'CuentaBancaria',
  localField: '_id',
  foreignField: 'proyecto',
  // justOne: true // Only return one owner
});

ProyectoSchema.virtual('gastos', {
  ref: 'Gasto',
  localField: '_id',
  foreignField: 'proyecto',
  // justOne: true // Only return one owner
});

ProyectoSchema.virtual('modificaciones', {
  ref: 'Modificacion',
  localField: '_id',
  foreignField: 'proyecto',
  // justOne: true // Only return one owner
});

ProyectoSchema.virtual('periodos', {
  ref: 'Periodo',
  localField: '_id',
  foreignField: 'proyecto',
  // justOne: true // Only return one owner
});

ProyectoSchema.virtual('etapas', {
  ref: 'Etapa',
  localField: '_id',
  foreignField: 'proyecto',
  // justOne: true // Only return one owner
});

ProyectoSchema.virtual('objetivo', {
  ref: 'Objetivo',
  localField: '_id',
  foreignField: 'proyecto',
  justOne: true // Only return one Objetivo
});

ProyectoSchema.virtual('objetivos_especificos', {
  ref: 'Objetivo',
  localField: '_id',
  foreignField: 'proyecto',
});

ProyectoSchema.pre('find', function () {
  this.populate('pais')
    .populate('estado_proyecto')
    .populate('informes')
    .populate('informes.proyecto_padre_id')
    .populate('informes.proyecto_padre_id.gastos');
  //   .populate('gestor')
  //   // .populate('actividad_global')
  //   .populate('partida')
  //   .populate('importe')
  //   .populate('aportaciones')
  //   .populate('bienes')
  //   .populate('presupuesto_ejecutado')
  //   .populate('importe_ejecutado')
  //   .populate('entidades')
  //   .populate('empresa')
  //   .populate('estado_proyecto')
  //   .populate('presupuestos')
  //   .populate('financiador')
  //   .populate('implementador')
  //   .populate('convocatoria')
  //   .populate('informes')
  //   .populate('personal')
  //   .populate('operaciones_bancarias')
  //   .populate('cuentas_bancarias')
  //   .populate('gastos')
  //   .populate('modificaciones')
  //   .populate('periodos')
  //   .populate('etapas')
  //   .populate('objetivo')
  //   .populate('objetivos_especificos');
});

ProyectoSchema.pre('findOne', function () {
  this.populate('pais')
    .populate('gestor')
    // .populate('actividad_global')
    .populate('partida')
    .populate('importe')
    .populate('aportaciones')
    .populate('bienes')
    .populate('presupuesto_ejecutado')
    .populate('importe_ejecutado')
    .populate('entidades')
    .populate('empresa')
    .populate('estado_proyecto')
    .populate('financiador')
    .populate('implementador')
    .populate('presupuestos')
    .populate('presupuestos.implementador')
    .populate('presupuestos.financiador')
    .populate('convocatoria')
    .populate('informes')
    .populate('personal')
    .populate('operaciones_bancarias')
    .populate('cuentas_bancarias')
    .populate('gastos')
    .populate('modificaciones')
    .populate('periodos')
    .populate('etapas')
    .populate({
      path: 'objetivo',
      match: {
        general: true
      }
    })
    .populate({
      path: 'objetivos_especificos',
      match: {
        general: false
      }
    })
});

module.exports = mongoose.model("Proyecto", ProyectoSchema);