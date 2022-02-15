const jwt = require('jsonwebtoken')

/* eslint-disable max-len , no-console */
module.exports = {
  /**
   * 将给定的签名和密钥计算出加密令牌字符串
   * @param {*} payload Payload to sign, could be an literal, buffer or string
   * @param {*} secretOrPrivateKey Either the secret for HMAC algorithms, or the PEM encoded private key for RSA and ECDSA.
   * @param {*} options Options for the signature
   * @returns The JSON Web Token string
   */
  jwtSign(payload, secretOrPrivateKey, options) {
    return jwt.sign(payload, secretOrPrivateKey, options)
  },
  /**
   * 以公钥和密钥计算出解码令牌字符串
   * @param {String} token JWT string to verify
   * @param {String} secretOrPublicKeyA string or buffer containing either the secret for HMAC algorithms,
   * or the PEM encoded public key for RSA and ECDSA. If jwt.verify is called asynchronous,
   * secretOrPublicKey can be a function that should fetch the secret or public key
   * @returns
   */
  jwtVerify(token, secretOrPublicKey) {
    return jwt.verify(token, secretOrPublicKey, (err, decoded) => {
      if (err) {
        console.log('Token exception')
        switch (err.name) {
          case 'TokenExpiredError':
            return { msg: 'Token overdue' }
          case 'JsonWebTokenError':
            return { msg: 'Token invalid' }
        }
      }
      return decoded
    })
  }
}
