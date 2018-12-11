const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const i18n = require('i18n');

const InformeSchema = new Schema({
  autor: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  nombre: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  periodo: {
    type: Schema.ObjectId,
    ref: 'Periodo',
    required: [true, i18n.__n("can't be blank")]
  },
  proyecto: {
    type: String
  },
  /* proyecto_id: {
    type: Schema.ObjectId,
    ref: Proyecto
  },*/
  proyecto_padre_id: {
    type: Schema.ObjectId,
    ref: 'Proyecto'
  },
  final:{
    type:Boolean
  },
  modificaciones_sustanciales: [{
    type: String, 
    default: [] 
  }],
  modificaciones_accidentales: [{
    type: String, 
    default: [] 
  }],
  actividades_previstas: [{
    type: String,
    default: []
  }],
  nuevas_actividades_npi: [{
    type: String,
    default: []
  }],
  valoracion_general: {
    type: String
  },
  grado_de_alineamiento: {
    type: String
  },
  puntos_fuertes_debiles: {
    type: String
  },
  observaciones: {
    type: String
  },
  modificacion_proyecto_inicial: {
    type: String
  },
  pertinencia: {
    type: String
  },
  coherencia: {
    type: String
  },
  eficacia_impacto: {
    type: String
  },
  eficiencia: {
    type: String
  },
  viabilidad_sostenibilidad: {
    type: String
  },
  amortizacion: {
    type: String
  },
  cobertura: {
    type: String
  },
  otros_criterios: {
    type: String
  },
  finalizacion_transferencia: {
    type: String
  },
  receptividad_sociolocal: {
    type: String
  },
  visibilidad_complementariedad: {
    type: String
  }
  // periodo: {
  //   type: Periodo
  // },
  // informe: { type: Schema.ObjectId, ref: "Informe" },

  // fecha_elaboracion: {
  //   type: Date,
  //   required: [true, i18n.__n("can't be blank")]
  // },
  // registros_actividad_no_ejecutadas: { type: Schema.ObjectId, ref: "RegistroActividad" },
  // registros_actividad_no_previstas: { type: Schema.ObjectId, ref: "RegistroActividad" }
}, {
  toJSON: {
    virtuals: true
  },
  timestamps: true
});
InformeSchema.pre('find', function () {
  this.populate('periodo')
  .populate('proyecto_padre_id');
});

InformeSchema.pre('findOne', function () {
  this.populate('periodo')
  .populate('proyecto_padre_id');
});
module.exports = mongoose.model("Informe", InformeSchema);