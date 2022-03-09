const { D_TCB_ENV, D_TCB_ID, D_TCB_KEY } = process.env

module.exports = {
  env: D_TCB_ENV,
  secretId: D_TCB_ID,
  secretKey: D_TCB_KEY
}
