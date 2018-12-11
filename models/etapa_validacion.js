let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let i18n = require('i18n');
const DefinicionValidacion = mongoose.model('DefinicionValidacion').schema;
const EtapaValidacionSchema = new Schema({
  nombre: { type: String, required: [true, i18n.__n("can't be blank")] },
  definiciones: {type: [DefinicionValidacion], default: []}
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });

module.exports = mongoose.model("EtapaValidacion", EtapaValidacionSchema);

