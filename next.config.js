// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
})

const withPlugins = (nextConfig = {}) => {
    return Object.assign({}, nextConfig, withBundleAnalyzer(withPWA(nextConfig)))
}

module.exports = withPlugins({
    reactStrictMode: true,
    swcMinify: true,
    cacheMaxMemorySize: 50,
})

module.exports = {
    async redirects() {
        return [
            {
                source: '/about',
                destination: '/',
                permanent: true,
            },
        ]
    },
}