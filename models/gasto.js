const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const i18n = require('i18n');

const GastoSchema = new Schema({
  proyecto: {
    type: String,
    required: [ true, i18n.__n("can't be blank")]
  },
  fecha: {
    type: Date,
    required: [true, i18n.__n("can't be blank")],
  },
  numero_orden: {
    type: String,
    required: [true, i18n.__n("can't be blank")],
  },
  emisor: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  concepto: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  importe_local: {
    type: Number,
    required: [true, i18n.__n("can't be blank")]
  },
  tipo_de_cambio_dm: {
    type: Number
  },
  tipo_de_cambio_ld: {
    type: Number
  },
  moneda: {
    type: Schema.ObjectId,
    ref: 'Moneda',
    required: [true, i18n.__n("can't be blank")]
  },
  partida: {
    type: Schema.ObjectId,
    ref: 'Partida',
    required: [true, i18n.__n("can't be blank")]
  },
  actividad: {
    type: Schema.ObjectId,
    ref: 'Actividad',
    required: [true, i18n.__n("can't be blank")]
  },
  financiador:  {
    type: Schema.ObjectId,
    ref: 'Agente',
    required: [true, i18n.__n("can't be blank")]
  },
  /* documentos: [{
    type: Schema.ObjectId,
    ref: 'Documento'
  }], */
  pagos: [{
    type: Schema.ObjectId,
    ref: 'Pago'
  }]
}, {
  toJSON: {
    virtuals: true
  },
  timestamps: true
});

GastoSchema.virtual('documentos', {
  ref: 'Documento',
  localField: '_id',
  foreignField: 'gasto',
  // justOne: true // Only return one owner
});

GastoSchema.pre('find', function () {
  this.populate('moneda')
  .populate('partida')
  .populate('actividad')
  .populate('financiador')
  .populate('documentos')
  .populate('pagos');
});

GastoSchema.pre('findOne', function () {
  this.populate('moneda')
  .populate('partida')
  .populate('actividad')
  .populate('financiador')
  .populate('documentos')
  .populate('pagos');
});

module.exports = mongoose.model("Gasto", GastoSchema);