let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let i18n = require('i18n');

let TipoMovimientoSchema = new Schema({
  valor: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  empresa: {
    type: Schema.ObjectId,
    ref: 'Empresa',
    required: [true, i18n.__n("can't be blank")]
  },
  es_entrada: {type: Boolean},
  origen: {type: Boolean},
  destino: {type: Boolean},
  pago: {type: Boolean},
  cheque: {type: Boolean}
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });
TipoMovimientoSchema.pre('find', function () {
  this.populate('empresa')
});

TipoMovimientoSchema.pre('findOne', function () {
  this.populate('empresa')
});
module.exports = mongoose.model("TipoMovimiento", TipoMovimientoSchema);
