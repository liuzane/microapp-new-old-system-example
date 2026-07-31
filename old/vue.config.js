module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  outputDir: '../dist/old',
  devServer: {
    port: Number(process.env.VUE_APP_PORT),
    open: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
