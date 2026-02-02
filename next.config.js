const path = require("path");

/** @type {import("next").NextConfig} */
module.exports = {
  turbopack: {
    root: path.join(__dirname),
  },

  //eliminar en producción
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imgs.search.brave.com",
      },
      {
        protocol: "https",
        hostname: "media.gettyimages.com",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  }, //eliminar en producción

  experimental: {
    reactCompiler: true, // ✅ Next 15 lo quiere aquí
  },
};
