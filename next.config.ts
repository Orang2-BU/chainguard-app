import type { NextConfig } from "next";

// Cache Components dimatikan dengan sengaja: dashboard membaca store
// in-memory yang berubah tiap ada kiriman data dari logger, jadi halaman
// harus dirender dinamis dengan model klasik.
const nextConfig: NextConfig = {};

export default nextConfig;
