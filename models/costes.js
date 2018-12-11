let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const i18n = require('i18n');
let CostesSchema = new Schema({
  valor: {
    type: String,
    required: [true, i18n.__n("can't be blank")]
  }
}, {
  toJSON: { virtuals: true },
  timestamps: true
});

module.exports = mongoose.model("Costes", CostesSchema);

