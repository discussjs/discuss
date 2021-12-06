const mongoose = require('mongoose')

module.exports = () => {
  mongoose.connect(process.env.DISCUSS_MONGODB, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
}
