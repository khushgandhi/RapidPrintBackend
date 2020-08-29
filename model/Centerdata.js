const mongoose = require("mongoose");

var centerDataSchema = mongoose.Schema({
  center_id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  address: {
    address_text: String,
    landmark: String,
    pincode: String,
    state: String,
    country: String,
    city: String,
    latitude: String,
    longitude: String,
  },
  timings: {
    type: Array,
    required: true,
  },
  price: { type: Object, required: true },
  center_status: { type: Number, required: true },
  location: {
    type: { type: String },
    coordinates: [],
  },
});
//centerDataSchema.index({ location: "2dsphere" });
module.exports = mongoose.model(
  "Centerdata",
  centerDataSchema,
  "Centerdata",
  true
);
