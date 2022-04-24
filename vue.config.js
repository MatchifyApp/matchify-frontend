const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  devServer: {
    allowedHosts: "all"
  },
  pwa: {
    name: 'Matchify',
    themeColor: "#195aff",
    msTileColor: "#195aff",
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black'
  }
})
