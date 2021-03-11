module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      nodeIntegration: true,
      externals: ['win-ca', 'node-forge'], // this excludes the native modules from the front end
    }
  }
}