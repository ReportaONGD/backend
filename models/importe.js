const i18n = require('i18n');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImporteSchema = new Schema({
  subvencion: {
    type: Number,
    required: [true, i18n.__n("can't be blank")]
  },
  rendimiento: {
    type: Number,
    required: [true, i18n.__n("can't be blank")]
  },
  detalle_importe: {
    type: Schema.ObjectId,
    ref: 'DetalleImporte'
  }
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });
ImporteSchema.pre('find', function () {
  this.populate('detalle_importe')
});
ImporteSchema.pre('findOne', function () {
  this.populate('detalle_importe')
});

module.exports = mongoose.model("Importe", ImporteSchema);