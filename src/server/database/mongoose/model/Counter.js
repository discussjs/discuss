const mongoose = require('mongoose')

const { model, Schema } = mongoose

const CounterSchema = new Schema(
  {
    time: { type: Number, default: 1, require: true },
    path: { type: String, default: '/', require: true },
    created: { type: Number, default: Date.now(), require: true },
    updated: { type: Number, default: Date.now(), require: true }
  },
  { versionKey: false }
)
const Counter = model('D_Counter', CounterSchema, 'D_counter')

module.exports = Counter
