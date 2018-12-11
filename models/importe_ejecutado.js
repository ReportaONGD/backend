const i18n = require('i18n');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImporteEjecutadoSchema = new Schema({
  importe: {
    type: Schema.ObjectId,
    ref: 'Importe',
    required: [true, i18n.__n("can't be blank")]
  }
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });

ImporteEjecutadoSchema.pre('find', function () {
  this.populate('importe')
});

ImporteEjecutadoSchema.pre('findOne', function () {
  this.populate('importe')
});
module.exports = mongoose.model("ImporteEjecutado", ImporteEjecutadoSchema);