/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  images: {
    //* Permitir dominios externos
    remotePatterns: [
      //   {
      //     protocol: "https",
      //     hostname: "avatars.githubusercontent.com", // ejemplo GitHub
      //   },
    ],

    //* Habilitar formatos modernos de compresión
    formats: ["image/avif", "image/webp"],

    //? Opcional: tamaños que usará next/image
    deviceSizes: [320, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96],
  },

  //? Opcional: elimina el header "X-Powered-By"
  poweredByHeader: false,
};

export default nextConfig;
