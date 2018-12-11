let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let TipoValoracion = require('./tipo_valoracion');
let i18n = require('i18n');

let ValoracionSchema = new Schema({
  descripcion: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  tipo_valoracion: { type: Schema.ObjectId, ref: "TipoValoracion", required: false }
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });

module.exports = mongoose.model("Valoracion", ValoracionSchema);
