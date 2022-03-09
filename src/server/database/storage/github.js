const { D_GH_TOKEN, D_GH_REPO, D_GH_PATH } = process.env

module.exports = {
  token: D_GH_TOKEN,
  repo: D_GH_REPO,
  path: D_GH_PATH
}
