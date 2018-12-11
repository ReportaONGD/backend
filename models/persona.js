let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let i18n = require('i18n');
let PersonaSchema = new Schema({
  nombre: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  categoria: {
    type: Schema.ObjectId,
    ref: 'Categoria'
  },
  residencia: {
    type: String
  },
  proyecto: {
    type: String
  },
  contrato: {
    type: Schema.ObjectId,
    ref: 'Contrato'
  },
  horas_imputadas: {
    type: Number
  },
  salario_mensual: {
    type: Number
  },
  meses: {
    type: Number
  },
  salario_total: {
    type: Number
  },
  tipo_personal: {
    type: Schema.ObjectId,
    ref: 'TipoPersonal'
  }
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });
PersonaSchema.pre('find', function () {
  this.populate('categoria')
  .populate('tipo_personal')
  .populate('contrato')
});

PersonaSchema.pre('findOne', function () {
  this.populate('categoria')
  .populate('tipo_personal')
  .populate('contrato')
});
module.exports = mongoose.model("Persona", PersonaSchema);

