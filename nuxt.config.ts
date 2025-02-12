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
    sitemap: ['https://nuxt.com/sitemap.xml'],
    allow: ['/'],
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
  }
})