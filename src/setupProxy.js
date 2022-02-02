const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "https://api.apis.net.pe",
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        "^/api": "",
      },
    })
  );
};
