/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://tecfazer.pt',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/admin',
    '/admin/*',
    '/portal',
    '/portal/*',
    '/api/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/portal', '/api'],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tecfazer.pt'}/sitemap.xml`,
    ],
  },
  transform: async (config, path) => {
    // Custom priority based on page importance
    let priority = 0.7
    let changefreq = 'weekly'

    if (path === '/pt' || path === '/en') {
      priority = 1.0
      changefreq = 'daily'
    } else if (path.includes('/portfolio') || path.includes('/blog')) {
      priority = 0.8
      changefreq = 'weekly'
    } else if (path.includes('/servicos') || path.includes('/precos')) {
      priority = 0.9
      changefreq = 'weekly'
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    }
  },
}
