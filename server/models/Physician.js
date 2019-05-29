const mongoose = require('mongoose');

// set phsician schema
const physicianSchema = new mongoose.Schema ({
  firstname: String,
  middlename: String,
  lastname: String,
  address: String,
  city: String,
  state: String
});

physicianSchema.index({firstname: 1, lastname: 1})

// call mongoose.model() on schema, compile a new model
Physician = mongoose.model('Physician', physicianSchema);

module.exports = Physician;