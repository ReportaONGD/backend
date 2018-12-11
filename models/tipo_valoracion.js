let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let i18n = require('i18n');

let TipoValoracionSchema = new Schema({
  valor: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  empresa: {
    type: Schema.ObjectId,
    ref: 'Empresa',
    required: [true, i18n.__n("can't be blank")]
  }
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });

module.exports = mongoose.model("TipoValoracion", TipoValoracionSchema);

