let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let i18n = require('i18n');

let PeriodoSchema = new Schema({
  nombre: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  fecha_inicio: {
    type: Date,
    required: [true, i18n.__n("can't be blank")]
  },
  fecha_fin: {
    type: Date,
  },
  tipo_periodo: {
    type: Schema.ObjectId,
    ref: 'TipoPeriodo',
    required: [true, i18n.__n("can't be blank")]
  },
  proyecto: {
    type: String
  }
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });
PeriodoSchema.pre('find', function () {
  this.populate('tipo_periodo')
});

PeriodoSchema.pre('findOne', function () {
  this.populate('tipo_periodo')
});
module.exports = mongoose.model("Periodo", PeriodoSchema);

