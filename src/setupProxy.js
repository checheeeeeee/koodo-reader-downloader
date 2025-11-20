const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  const apiBase = process.env.REACT_APP_API_BASE_URL || "/proxy-api";
  const apiTarget = process.env.REACT_APP_API_PROXY_URL || "";
  if (apiTarget) {
    app.use(
      apiBase,
      createProxyMiddleware({
        target: apiTarget,
        changeOrigin: true,
        pathRewrite: (path) => path.replace(new RegExp(`^${apiBase}`), ""),
      })
    );
  }
};