let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let i18n = require('i18n');

let PaisSchema = new Schema({
  valor: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  moneda: {
    type: Schema.ObjectId,
    ref: 'Moneda',
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

PaisSchema.pre('find', function () {
  this.populate('empresa')
});
PaisSchema.pre('findOne', function () {
  this.populate('empresa')
});
module.exports = mongoose.model("Pais", PaisSchema);

