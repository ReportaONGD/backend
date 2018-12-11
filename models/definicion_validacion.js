let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let i18n = require('i18n');
const ReglaValidacion = mongoose.model('ReglaValidacion').schema;
const DefinicionValidacionSchema = new Schema({
  nombre: { type: String, required: [true, i18n.__n("can't be blank")] },
  model: {type: String},
  reglas: {type: [ReglaValidacion], default: []}
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });

module.exports = mongoose.model("DefinicionValidacion", DefinicionValidacionSchema);

