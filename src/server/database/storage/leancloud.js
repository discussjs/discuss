const { D_LC_ID, D_LC_KEY, D_LC_MKEY } = process.env

module.exports = {
  appId: D_LC_ID,
  appKey: D_LC_KEY,
  masterKey: D_LC_MKEY
}
