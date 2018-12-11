let mongoose = require('mongoose');
const i18n = require('i18n');
let Schema = mongoose.Schema;

const HipotesisSchema = new Schema({
  descripcion: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  },
  objetivo: {
    type: String,
  },
  resultado: {
    type: String,
  }
}, {
  toJSON: {
    virtuals: true
  },
  timestamps: true
});

module.exports = mongoose.model("Hipotesis", HipotesisSchema);