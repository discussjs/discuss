const { D_IC_ID, D_IC_KEY } = process.env

module.exports = {
  serviceId: D_IC_ID,
  serviceSecret: D_IC_KEY
}
