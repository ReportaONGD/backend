let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const i18n = require('i18n');
let EmpresaSchema = new Schema({
    nombre: {
      type: String,
      required: [ true, i18n.__n("can't be blank")]
    },
    cif: {
      type: String,
      required: [ true, i18n.__n("can't be blank")]
    },
    direccion_fiscal: {
      type: String,
      required: [ true, i18n.__n("can't be blank")]
    },
    tfno: {
      type: String,
      required: [ true, i18n.__n("can't be blank")]
    }
  }, 
  {
    toJSON: { virtuals: true },
    timestamps: true
  }
);

module.exports = mongoose.model("Empresa", EmpresaSchema);