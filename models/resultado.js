let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let i18n = require('i18n');
const Comentario = mongoose.model('Comentario').schema;

const ResultadoSchema = new Schema({
  codigo: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  descripcion: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  coste_total: {
    type: Number
  },
  duracion: {
    type: Number
  },
  objetivo: {
    type: String,
    required: [ true, i18n.__n("can't be blank")]
  },
  /* comentarios: [{
    type: Schema.ObjectId,
    ref: 'Comentario'
  }] */
}, {
  toJSON: {
    virtuals: true
  },
  timestamps: true
});

ResultadoSchema.virtual('comentarios', {
  ref: 'Comentario',
  localField: '_id',
  foreignField: 'objetivo',
  // justOne: true // Only return one owner
});

ResultadoSchema.virtual('actividades', {
  ref: 'Actividad',
  localField: '_id',
  foreignField: 'resultado',
});

ResultadoSchema.virtual('hipotesis', {
  ref: 'Hipotesis',
  localField: '_id',
  foreignField: 'resultado',
  // justOne: true // Only return one owner
});

ResultadoSchema.virtual('indicadores', {
  ref: 'Indicador',
  localField: '_id',
  foreignField: 'resultado',
  // justOne: true // Only return one owner
});


ResultadoSchema.pre('find', function () {
  this.populate('actividades')
  .populate('hipotesis')
  .populate('comentarios')
  .populate('indicadores');
});

ResultadoSchema.pre('findOne', function () {
  this.populate('actividades')
  .populate('hipotesis')
  .populate('comentarios')
  .populate('indicadores');
});


module.exports = mongoose.model("Resultado", ResultadoSchema);