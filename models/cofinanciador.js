let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const i18n = require('i18n');
const Empresa = require('./empresa');
let CofinanciadorSchema = new Schema({
  valor: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  publica: {
    type: Boolean, defaultValue: true
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

module.exports = mongoose.model("Cofinanciador", CofinanciadorSchema);

