let mongoose = require('mongoose');
const i18n = require('i18n');
let Schema = mongoose.Schema;
const Progreso = mongoose.model('Progreso').schema;
const PlanificacionActividad = mongoose.model('PlanificacionActividad').schema;
const EjecucionActividad = mongoose.model('EjecucionActividad').schema;

const ActividadSchema = new Schema({
  codigo: {
    type: String, 
    required: [true, i18n.__n("can't be blank")]
  },
  descripcion: {
    type: String, 
    required: [true, i18n.__n("can't be blank")]
  },
  comentario: {
    type: String
  },
  comentarios_ong: {
    type: String
  },
  comentarios_aecid: {
    type: String
  },
  comentarios_costes_personal: {
    type: String
  },
  progreso: {
    type: Schema.ObjectId,
    ref: 'Progreso'
  },
  planificacion_actividad: PlanificacionActividad,
  ejecucion_actividad: EjecucionActividad,
  global: {
    type: Boolean, defaultValue: false
  },
  /* comentarios: [{
    type: Schema.ObjectId,
    ref: 'Comentario'
  }], */
  etapa: {
    type: Schema.ObjectId,
    ref: 'Etapa',
    required: [true, i18n.__n("can't be blank")]
  },
  resultado: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
}, {
    toJSON: { virtuals: true },
    timestamps: true
  }
);

ActividadSchema.virtual('comentarios', {
  ref: 'Comentario',
  localField: '_id',
  foreignField: 'actividad',
  // justOne: true // Only return one owner
});

ActividadSchema.pre('find', function () {
  this.populate('progreso')
  .populate('comentarios')
  .populate('etapa');
});

ActividadSchema.pre('findOne', function () {
  this.populate('progreso')
  .populate('comentarios')
  .populate('etapa');
});


module.exports = mongoose.model("Actividad", ActividadSchema);

