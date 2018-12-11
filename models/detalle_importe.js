let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const i18n = require('i18n');
let DetalleImporteSchema = new Schema({
  ongd: {
    type: Number,
    required: [true, i18n.__n("can't be blank")]

  },
  local: {
    type: Boolean,
    defaultValue: true
  },
  exterior: {
    type: Boolean,
    defaultValue: false
  }
}, {
    toJSON: { virtuals: true },
    timestamps: true
  });

module.exports = mongoose.model("DetalleImporte", DetalleImporteSchema);

