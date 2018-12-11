const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const i18n = require('i18n');
let Actividad = mongoose.model('Actividad').schema;
let Etapa = mongoose.model('Etapa').schema;
let Financiador = mongoose.model('Financiador').schema;
let Implementador = mongoose.model('Implementador').schema;
let Pais = mongoose.model('Pais').schema;
let Moneda = mongoose.model('Moneda').schema;
let Partida = mongoose.model('Partida').schema;

let PresupuestoSchema = new Schema({
  concepto: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  observaciones: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  importe: {
    type: Number,
    required: [true, i18n.__n("can't be blank")]
  },
  etapa: {
    type: Schema.ObjectId,
    ref: 'Etapa'
  },
  actividad: {
    type: Schema.ObjectId,
    ref: 'Actividad'
  },
  financiador: {
    type: Schema.ObjectId,
    ref: 'Agente',
    required: [true, i18n.__n("can't be blank")]
  },
  proyecto: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  implementador: {
    type: Schema.ObjectId,
    ref: 'Agente',
    required: [true, i18n.__n("can't be blank")]
  },
  pais: {
    type: Schema.ObjectId,
    ref: 'Pais'
  },
  moneda: {
    type: Schema.ObjectId,
    ref: 'Moneda',
    required: [true, i18n.__n("can't be blank")]
  },
  partida: {
    type: Schema.ObjectId,
    ref: 'Partida'
  }
}, {
  toJSON: {
    virtuals: true
  },
  timestamps: true
});

PresupuestoSchema.pre('find', function () {
  this.populate('etapa')
    .populate('actividad')
    .populate('financiador')
    .populate('implementador')
    .populate('pais')
    .populate('moneda')
    .populate('partida')
});

PresupuestoSchema.pre('findOne', function () {
  this.populate('etapa')
    .populate('actividad')
    .populate('financiador')
    .populate('implementador')
    .populate('pais')
    .populate('moneda')
    .populate('partida')
});

module.exports = mongoose.model("Presupuesto", PresupuestoSchema);