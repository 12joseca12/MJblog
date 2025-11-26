const path = require("path");

/** @type {import("next").NextConfig} */
module.exports = {
  turbopack: {
    root: path.join(__dirname),
  },

  experimental: {
    reactCompiler: true, // ✅ Next 15 lo quiere aquí
  },
};
