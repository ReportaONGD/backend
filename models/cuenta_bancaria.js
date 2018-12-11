const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const i18n = require('i18n');

const CuentaBancariaSchema = new Schema({
  pais: {
    type: Schema.ObjectId,
    ref: 'Pais',
    required: [true, i18n.__n("can't be blank")]
  },
  proyecto: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  entidad: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  ncuenta: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  moneda: {
    type: Schema.ObjectId,
    ref: 'Moneda',
    required: [true, i18n.__n("can't be blank")]
  },
  localizacion: {
    type: Schema.ObjectId,
    ref: 'Localizacion',
    required: [true, i18n.__n("can't be blank")]
  },
},
  {
    toJSON: { virtuals: true },
    timestamps: true
  }
);


CuentaBancariaSchema.pre('find', function () {
  this.populate('moneda')
    .populate('localizacion')
    .populate('pais');
});


module.exports = mongoose.model("CuentaBancaria", CuentaBancariaSchema);