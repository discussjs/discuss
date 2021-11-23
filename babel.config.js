module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['last 2 versions'] // 最近 2 个版本的浏览器
        }
      }
    ]
  ],
  plugins: ['@babel/plugin-transform-runtime'], // 解决 regeneratorRuntime is not defined 错误信息
  sourceType: 'unambiguous' // 解决ES6和CommonJS模块导出的问题: https://babeljs.io/docs/en/options#sourcetype
}
