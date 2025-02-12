// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'pinia-plugin-persistedstate',
    '@formkit/auto-animate',
    '@nuxtjs/sitemap',
    '@nuxtjs/color-mode',
    '@nuxtjs/robots',
    'shadcn-nuxt',
    '@nuxt/icon',
    '@nuxtjs/seo'
  ],
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.ts',
    exposeConfig: true,
    viewer: true,
  },
  robots: {
    enabled: true,
    sitemap: ['/sitemap.xml'],
    allow: ['/'],
    disallow: ['/api/']
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    dataValue: 'theme'
  },
  runtimeConfig: {
    public: {
      githubToken: process.env.GITHUB_TOKEN
    }
  },
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://your-production-domain.com',
    name: 'GitHub Open Source Explorer',
    description: 'Explore amazing open source projects on GitHub',
    defaultLocale: 'en'
  },
  sitemap: {
    enabled: true,
    urls: [
      '/',
      '/about',
      '/topics',
      '/collections'
    ],
    defaults: {
      changefreq: 'daily',
      priority: 0.8,
      lastmod: new Date().toISOString()
    }
  },
  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'GitHub Open Source Explorer',
      logo: 'https://your-domain.com/logo.png'
    },
    host: process.env.NUXT_PUBLIC_SITE_URL || 'https://your-production-domain.com',
    includeHomeInBreadcrumb: false
  },
  routeRules: {
    // Página principal
    '/': { 
      sitemap: { priority: 1.0, changefreq: 'daily' },
      seoMeta: {
        title: 'GitHub Open Source Explorer - Discover Amazing Projects',
        description: 'Explore thousands of open source projects, find new tools, libraries and frameworks on GitHub.',
        ogImage: '/images/home-og.png',
      }
    },
    // Páginas de colecciones
    '/collections': { 
      sitemap: { priority: 0.9, changefreq: 'daily' },
      seoMeta: {
        title: 'Collections - Curated Open Source Projects',
        description: 'Browse curated collections of open source projects organized by purpose and technology.',
        ogImage: '/images/collections-og.png',
      }
    },
    '/collections/**': { 
      sitemap: { priority: 0.8, changefreq: 'weekly' },
      seoMeta: {
        titleTemplate: '%s Collection - GitHub Open Source Explorer',
        ogType: 'article',
        author: 'GitHub Open Source Explorer'
      }
    },
    // Páginas de temas
    '/topics': { 
      sitemap: { priority: 0.9, changefreq: 'daily' },
      seoMeta: {
        title: 'Topics - Browse by Technology and Concept',
        description: 'Explore open source projects by programming language, framework, or concept.',
        ogImage: '/images/topics-og.png',
      }
    },
    '/topics/**': { 
      sitemap: { priority: 0.8, changefreq: 'weekly' },
      seoMeta: {
        titleTemplate: '%s Projects - GitHub Open Source Explorer',
        ogType: 'article',
        author: 'GitHub Open Source Explorer'
      }
    },
    // Páginas de repositorios
    '/repository/**': { 
      sitemap: { priority: 0.8, changefreq: 'weekly' },
      seoMeta: {
        titleTemplate: '%s - Open Source Repository',
        ogType: 'article',
        author: 'GitHub Open Source Explorer'
      }
    },
    // Página About
    '/about': { 
      sitemap: { priority: 0.7, changefreq: 'monthly' },
      seoMeta: {
        title: 'About - GitHub Open Source Explorer',
        description: 'Learn more about GitHub Open Source Explorer and the technology behind it.',
        ogImage: '/images/about-og.png',
      }
    },
    // Rutas de API
    '/api/**': { 
      sitemap: false,
      robots: false,
      index: false
    }
  },

  // SEO meta tags globales
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@yourusername' },
        { name: 'twitter:creator', content: '@yourusername' },
        { name: 'theme-color', content: '#0D1117' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'manifest', href: '/manifest.json' }
      ]
    }
  },

  // Reglas de caché para recursos estáticos
  nitro: {
    routeRules: {
      '/images/**': { headers: { 'cache-control': 'max-age=31536000' } },
      '/fonts/**': { headers: { 'cache-control': 'max-age=31536000' } },
      '/manifest.json': { prerender: false }
    }
  }
})