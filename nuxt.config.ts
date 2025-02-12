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
    '@nuxt/icon'
  ],
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.ts',
    exposeConfig: true,
    viewer: true,
  },
  robots: {
    rules: {
      UserAgent: '*',
      Allow: '/',
      Sitemap: 'https://nuxt.com/sitemap.xml'
    }
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  }
})