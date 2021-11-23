function VerifyParams(Param, requiredParams) {
  for (const requiredParam of requiredParams) {
    if (!Param[requiredParam]) {
      throw new Error(`参数"${requiredParam}"不合法`)
    }
  }
}

module.exports = VerifyParams
