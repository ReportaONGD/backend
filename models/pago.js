let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const i18n = require('i18n');

let PagoSchema = new Schema({
  tipo_movimiento: {
    type: Schema.ObjectId,
    ref: 'TipoMovimiento',
    required: [true, i18n.__n("can't be blank")]
  },
  cuenta_origen: {
    type: Schema.ObjectId,
    ref: 'CuentaBancaria',
    required: [true, i18n.__n("can't be blank")]
  },
  cuenta_destino: {
    type: Schema.ObjectId,
    ref: 'CuentaBancaria'
  },
  concepto: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  importe: {
    type: Number,
    required: [true, i18n.__n("can't be blank")]
  },
  gasto: {
    type: String
  },
  importe_enviado: {
    type: Number
  },
  descripcion: {
    type: String
  },
  fecha: {
    type: String
  },
  num_cheque: {
    type: String
  }
}, {
  toJSON: {
    virtuals: true
  },
  timestamps: true
});

PagoSchema.pre('find', function () {
  this.populate('cuenta_origen')
  .populate('cuenta_destino')
  .populate('tipo_movimiento')
});

PagoSchema.pre('findOne', function () {
  this.populate('cuenta_origen')
  .populate('cuenta_destino')
  .populate('tipo_movimiento')
});

module.exports = mongoose.model("Pago", PagoSchema);