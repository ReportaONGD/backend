const mongoose = require("mongoose");
const Progreso = mongoose.model('Progreso').schema;
let i18n = require('i18n');
const Schema = mongoose.Schema;
const FuenteVerificacion = mongoose.model('FuenteVerificacion').schema;
const Medida = mongoose.model('Medida').schema;
const Comentario = mongoose.model('Comentario').schema;
const IndicadorSchema = new Schema({
  codigo: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  descripcion: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  linea_base: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  meta: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  comentario: {
    type: String,
  },
  comentarios_ong: {
    type: String,
  },
  comentarios_aecid: {
    type: String,
  },
  progreso: Progreso,
  // fuente_verificacion: {
  //   type: [FuenteVerificacion],
  //   default: []
  // },
  // medida: {
  //   type: [Medida],
  //   default: []
  // },
  /* comentarios: [{
    type: String,
  }], */
  /* comentarios: [{
    type: Schema.ObjectId,
    ref: 'Comentario'
  }], */
  objetivo: {
    type: String,
  },
  resultado: {
    type: String,
  }
}, {
  toJSON: {
    virtuals: true
  },
  timestamps: true
});

IndicadorSchema.virtual('fuente_verificacion', {
  ref: 'FuenteVerificacion',
  localField: '_id',
  foreignField: 'indicador',
  // justOne: true // Only return one owner
});

IndicadorSchema.virtual('comentarios', {
  ref: 'Comentario',
  localField: '_id',
  foreignField: 'indicador',
  // justOne: true // Only return one owner
});

IndicadorSchema.virtual('medida', {
  ref: 'Medida',
  localField: '_id',
  foreignField: 'indicador',
  // justOne: true // Only return one owner
});


IndicadorSchema.pre('findOne', function () {
  this.populate('medida')
  .populate('fuente_verificacion')
  .populate('comentarios');
});

IndicadorSchema.pre('find', function () {
  this.populate('medida')
  .populate('fuente_verificacion')
  .populate('comentarios');
});

module.exports = mongoose.model("Indicador", IndicadorSchema);