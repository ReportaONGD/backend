const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let i18n = require('i18n');

const MovimientoCuentaBancariaSchema = new Schema({
  fecha: {
    type: Date,
    default: Date.now,
    required: [true, i18n.__n("can't be blank")]
  },
  tipo_movimiento: { type: Schema.ObjectId, ref: 'TipoMovimiento' }
},{
  toJSON: { virtuals: true },
  timestamps: true
});

module.exports = mongoose.model("MovimientoCuentaBancaria", MovimientoCuentaBancariaSchema);