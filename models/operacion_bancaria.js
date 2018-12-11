const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const i18n = require('i18n');

const OperacionBancariaSchema = new Schema({
  fecha: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  fecha_destino: {
    type: String,
  },
  importe: {
    type: Number,
    required: [true, i18n.__n("can't be blank")]
  },
  importe_enviado: {
    type: Number,
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
  gastos: [{
    type: Schema.ObjectId,
    ref: 'Gasto',
    required: [true, i18n.__n("can't be blank")]
  }],
  tipo_movimiento: {
    type: Schema.ObjectId,
    ref: 'TipoMovimiento',
    required: [true, i18n.__n("can't be blank")]
  },
  concepto: {
    type: String
  },
  cuenta_origen: {
    type: Schema.ObjectId,
    ref: 'CuentaBancaria',
    required: [true, i18n.__n("can't be blank")]
  },
  cuenta_destino: {
    type: Schema.ObjectId,
    ref: 'CuentaBancaria',
  },
  num_cheque: {
    type: String
  }
});

OperacionBancariaSchema.pre('find', function () {
  this.populate('financiador')
    .populate('tipo_movimiento')
    .populate('gastos')
    .populate('cuenta_destino')
    .populate('cuenta_origen')
});

OperacionBancariaSchema.pre('findOne', function () {
  this.populate('financiador')
    .populate('tipo_movimiento')
    .populate('gastos')
    .populate('cuenta_destino')
    .populate('cuenta_origen')
});

module.exports = mongoose.model("OperacionBancaria", OperacionBancariaSchema);