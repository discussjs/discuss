const mongoose = require("mongoose")

const { model, Schema } = mongoose

const CounterSchema = new Schema({
  time: { type: Number,default:1, require: true },
  path: { type: String, require: true },
  createdDate: { type: String, require: true },
  updatedDate: { type: String, require: true },
}, { versionKey: false })
const Counter = model("D_Counter", CounterSchema, "D_counter")

module.exports = Counter
