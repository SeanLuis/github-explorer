<script setup lang="ts">
useSeoMeta({
  title: 'GitHub Explorer for VS Code - The Ultimate GitHub Integration',
  description: 'Enhance your VS Code workflow with powerful GitHub integration. Search, organize, and manage repositories directly from your editor.',
  ogTitle: 'GitHub Explorer for VS Code Extension',
  ogDescription: 'The most powerful GitHub integration for Visual Studio Code',
  ogImage: '/screenshots/overview.png',
  ogUrl: 'https://github-explorer.nuxt.dev/extension',
  twitterCard: 'summary_large_image',
  twitterTitle: 'GitHub Explorer for VS Code',
  twitterDescription: 'Transform your GitHub workflow with our VS Code extension',
  twitterImage: '/screenshots/overview.png',
  twitterSite: '@SeanLuisGuada',
  twitterCreator: '@SeanLuisGuada'
})

useSchemaOrg([
  defineWebPage({
    '@type': 'WebPage',
    name: 'GitHub Explorer for VS Code',
    description: 'A powerful GitHub integration that brings repository management directly into your VS Code environment.'
  }),
  {
    '@type': 'SoftwareApplication',
    name: 'GitHub Explorer for VS Code',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Windows, macOS, Linux',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '50'
    }
  },
  defineArticle({
    headline: 'GitHub Explorer for VS Code - The Ultimate GitHub Integration',
    description: 'Enhance your VS Code workflow with powerful GitHub integration. Search, organize, and manage repositories directly from your editor.',
    image: '/screenshots/overview.png',
    datePublished: '2024-01-01',
    dateModified: '2024-02-14'
  }),
  {
    '@type': 'SoftwareApplication',
    name: 'GitHub Explorer for VS Code',
    operatingSystem: 'Windows, macOS, Linux',
    applicationCategory: 'DeveloperApplication',
    downloadUrl: 'https://marketplace.visualstudio.com/items?itemName=SeanLuisGuadaRodriguez.opensource-explorer',
    author: {
      '@type': 'Person',
      name: 'Sean Luis Guada Rodriguez',
      url: 'https://github.com/SeanLuis'
    },
    version: '1.2.0',
    screenshot: [
      '/screenshots/overview.png',
      '/screenshots/toolbar.png',
      '/screenshots/repo-list.png',
      '/screenshots/repo-actions.png'
    ].map(url => ({
      '@type': 'ImageObject',
      url,
      caption: 'GitHub Explorer for VS Code Screenshot'
    }))
  }
])

useHead({
  meta: [
    { name: 'keywords', content: 'vscode extension, github, repository management, developer tools, open source, productivity, code explorer' },
    { name: 'author', content: 'Sean Luis Guada Rodriguez' },
    { name: 'robots', content: 'index, follow' },
    { name: 'revisit-after', content: '7 days' },
    { name: 'rating', content: 'General' },
    { name: 'copyright', content: '© 2024 GitHub Explorer' },
    { 'http-equiv': 'Cache-Control', content: 'no-cache' },
    { name: 'theme-color', content: '#0066b8' }
  ],
  link: [
    { rel: 'canonical', href: 'https://github-explorer.nuxt.dev/extension' }
  ]
})

const mainFeatures = [
  {
    icon: 'octicon:telescope-24',
    title: 'Enhanced Repository View',
    description: 'New tabbed interface with full Markdown support for READMEs and intuitive navigation.',
    highlight: 'New in 1.2.0'
  },
  {
    icon: 'octicon:repo-clone-16',
    title: 'Smart Clone Commands',
    description: 'Automatic git clone prefix and path memory for faster repository setup.',
    highlight: 'Popular'
  },
  {
    icon: 'octicon:project-16',
    title: 'Collection Management',
    description: 'Organize repositories into custom collections.',
    highlight: 'Trending'
  }
]

const detailedFeatures = {
  search: {
    title: 'Advanced Search & Filters',
    description: 'Find exactly what you need with powerful search capabilities.',
    features: [
      { icon: 'octicon:search-16', text: 'Search repositories globally' },
      { icon: 'octicon:filter-16', text: 'Filter by language and stars' },
      { icon: 'octicon:code-16', text: 'Language navigation' },            
      { icon: 'octicon:sort-desc-16', text: 'Multiple sorting options' }
    ],
    image: '/screenshots/search-filters.png'
  },
  quickActions: {
    title: 'Quick Actions at Your Fingertips',
    description: 'Perform common operations with a single click.',
    features: [
      { icon: 'octicon:star-16', text: 'Star/Unstar repositories' },
      { icon: 'octicon:repo-forked-16', text: 'Fork repositories instantly' },
      { icon: 'octicon:repo-clone-16', text: 'Clone with path memory' },
      { icon: 'octicon:link-16', text: 'Quick copy clone commands' }
    ],
    image: '/screenshots/repo-actions.png'
  },
  collections: {
    title: 'Smart Collections',
    description: 'Keep your repositories organized and accessible.',
    features: [
      { icon: 'octicon:project-16', text: 'Create custom collections' },
      { icon: 'octicon:star-16', text: 'Favorite repositories access' },
      { icon: 'octicon:sync-16', text: 'Auto-refresh capability' }
    ],
    image: '/screenshots/collections.png'
  }
}

const activeTab = ref('files')

// Definir tipos para los pasos de instalación
type InstallStep = {
  text: string;
  icon: string;
  code?: string;
}

type InstallMethod = {
  title: string;
  steps: InstallStep[];
}

type InstallSteps = {
  vscode: InstallMethod;
  cli: InstallMethod;
}

// Definir tipos para la configuración
type ConfigExample = {
  title: string;
  code: string;
}

type ConfigExamples = {
  basic: ConfigExample;
  display: ConfigExample;
  search: ConfigExample;
}

// Referencias tipadas
const installTabs = ref<keyof InstallSteps>('vscode')
const configTabs = ref<keyof ConfigExamples>('basic')

// Objetos con tipos
const installSteps: InstallSteps = {
  vscode: {
    title: 'VS Code',
    steps: [
      { text: 'Open VS Code', icon: 'vscode-icons:file-type-vscode' },
      { text: 'Open Quick Open (Cmd+P / Ctrl+P)', icon: 'octicon:command-palette-16' },
      { 
        text: 'Run:', 
        code: 'ext install SeanLuisGuadaRodriguez.opensource-explorer',
        icon: 'octicon:terminal-16' 
      }
    ]
  },
  cli: {
    title: 'Command Line',
    steps: [
      { 
        text: 'Using VS Code CLI:', 
        code: 'code --install-extension SeanLuisGuadaRodriguez.opensource-explorer',
        icon: 'octicon:terminal-16'
      }
    ]
  }
}

const configExamples: ConfigExamples = {
  basic: {
    title: 'Basic Settings',
    code: `{
  "opensource-explorer.autoRefresh": true,
  "opensource-explorer.refreshInterval": 300,
  "opensource-explorer.defaultClonePath": "/preferred/clone/path"
}`
  },
  display: {
    title: 'Display Settings',
    code: `{
  "opensource-explorer.showIssuesCount": true,
  "opensource-explorer.showLanguageIcons": true,
  "opensource-explorer.dateFormat": "medium"
}`
  },
  search: {
    title: 'Search Settings',
    code: `{
  "opensource-explorer.defaultSearchSort": "stars",
  "opensource-explorer.minStars": 10,
  "opensource-explorer.languageFilter": "",
  "opensource-explorer.trendingPeriod": "week"
}`
  }
}

// Funciones auxiliares para el copiado
const copyToClipboard = (text: string) => {
  try {
    window.navigator.clipboard.writeText(text)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

</script>

<template>
  <div class="space-y-32">
    <section class="relative py-24 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-tr from-primary/10 via-violet-500/5 to-background" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,rgba(var(--primary-rgb),0.1),transparent)]" />
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center space-y-8">
          <div class="inline-flex items-center space-x-2 bg-muted/50 p-1 pl-2 pr-3 rounded-full text-sm">
            <span class="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs font-medium">New</span>
            <span>Version 1.2.1 is now available</span>
          </div>
          
          <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
            <span class="block">GitHub Explorer for</span>
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-primary via-violet-500 to-primary">VS Code</span>
          </h1>
          
          <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
            The most powerful GitHub integration for Visual Studio Code. Search, explore, and manage repositories directly from your editor.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              class="h-14 px-8 text-lg animate-shimmer bg-primary/90"
            >
              <Icon name="vscode-icons:file-type-vscode" class="mr-2 h-5 w-5" />
              <a target="_blank" href="https://marketplace.visualstudio.com/items?itemName=SeanLuisGuadaRodriguez.opensource-explorer">Install Extension</a>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              class="h-14 px-8 text-lg"
              
            >
              <a target="_blank" href="https://github.com/SeanLuis/github-explorer/blob/master/vscode-extension/README.md">
                Read Documentation
              </a>
            </Button>
          </div>
        </div>

        <div class="mt-20 relative">
          <div class="absolute inset-0 bg-gradient-to-tr from-primary/10 to-violet-500/10 rounded-xl blur-3xl" />
          <div class="relative rounded-xl border bg-card/50 backdrop-blur-sm shadow-2xl">
            <div class="flex items-center gap-2 p-4 border-b">
              <div class="flex space-x-2">
                <div class="h-3 w-3 rounded-full bg-red-500" />
                <div class="h-3 w-3 rounded-full bg-yellow-500" />
                <div class="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div class="flex-1 text-center text-sm font-medium text-muted-foreground">
                GitHub Explorer
              </div>
            </div>
            <div class="p-4">
              <img 
                src="/screenshots/overview.png" 
                alt="VS Code Extension Demo"
                class="rounded-lg border shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="relative py-24 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold mb-4">
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-500">
              Everything You Need
            </span>
          </h2>
          <p class="text-xl text-muted-foreground">
            Powerful features to streamline your GitHub workflow
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            v-for="feature in mainFeatures" 
            :key="feature.title"
            class="group relative p-8 rounded-xl border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300"
          >
            <div class="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            <div class="relative">
              <div class="mb-4 flex items-center justify-between">
                <Icon 
                  :name="feature.icon"
                  class="h-10 w-10 text-primary"
                />
                <span 
                  v-if="feature.highlight"
                  class="text-xs font-medium px-2 py-1 rounded-full"
                  :class="{
                    'bg-primary/10 text-primary': feature.highlight === 'New in 1.2.0',
                    'bg-orange-500/10 text-orange-500': feature.highlight === 'Popular',
                    'bg-green-500/10 text-green-500': feature.highlight === 'Trending'
                  }"
                >
                  {{ feature.highlight }}
                </span>
              </div>
              <h3 class="text-xl font-semibold mb-3">{{ feature.title }}</h3>
              <p class="text-muted-foreground">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section 
      v-for="(section, key) in detailedFeatures" 
      :key="key"
      class="py-24"
      :class="key === 'quickActions' ? 'bg-accent/30' : ''"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="space-y-8">
            <h3 class="text-3xl font-bold">{{ section.title }}</h3>
            <p class="text-xl text-muted-foreground">{{ section.description }}</p>
            <div class="space-y-4">
              <div 
                v-for="feature in section.features" 
                :key="feature.text"
                class="flex items-center gap-4 p-4 rounded-lg border bg-card/50 backdrop-blur-sm"
              >
                <Icon 
                  :name="feature.icon"
                  class="h-6 w-6 text-primary shrink-0"
                />
                <span>{{ feature.text }}</span>
              </div>
            </div>
          </div>

          <div v-if="key === 'search'" class="grid grid-cols-2 md:grid-cols-2 gap-4">
            <div class="grid gap-4">
              <div class="group relative rounded-lg overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-tr from-primary/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <img 
                  src="/screenshots/toolbar.png" 
                  alt="Search and Filter Toolbar"
                  class="h-auto max-w-full rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <div class="group relative rounded-lg overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-tr from-primary/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <img 
                  src="/screenshots/repo-list.png" 
                  alt="Repository List"
                  class="h-auto max-w-full rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
            </div>
            <div class="grid gap-4">
              <div class="group relative rounded-lg overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-tr from-primary/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <img 
                  src="/screenshots/repo-actions.png" 
                  alt="Repository Actions"
                  class="h-auto max-w-full rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <div class="group relative rounded-lg overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-tr from-primary/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <img 
                  src="/screenshots/repo-details.png" 
                  alt="Repository Details"
                  class="h-auto max-w-full rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>

          <div v-else class="relative">
            <div class="absolute inset-0 bg-gradient-to-tr from-primary/20 to-violet-500/20 rounded-xl blur-3xl" />
            <img 
              :src="section.image" 
              :alt="section.title"
              class="relative rounded-xl border shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Installation Section -->
    <section class="py-12 sm:py-24 bg-accent/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8 sm:mb-16">
          <h2 class="text-2xl sm:text-3xl font-bold">Installation & Usage</h2>
          <p class="text-lg sm:text-xl text-muted-foreground mt-4">Get started in minutes</p>
        </div>

        <!-- Installation Tabs -->
        <div class="mb-8 sm:mb-16">
          <div class="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8 justify-center">
            <Button 
              v-for="(method, key) in installSteps"
              :key="key"
              :variant="installTabs === key ? 'default' : 'outline'"
              @click="installTabs = key as keyof InstallSteps"
              class="gap-2 text-sm sm:text-base"
            >
              <Icon :name="key === 'vscode' ? 'vscode-icons:file-type-vscode' : 'octicon:terminal-16'" class="w-4 h-4" />
              {{ method.title }}
            </Button>
          </div>

          <div class="max-w-2xl mx-auto rounded-xl border bg-card p-3 sm:p-6">
            <div class="space-y-4 sm:space-y-6">
              <div 
                v-for="(step, index) in installSteps[installTabs].steps"
                :key="index"
                class="flex items-start gap-3 sm:gap-4"
              >
                <div class="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon :name="step.icon" class="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <div class="flex-1 min-w-0"> <!-- Added min-w-0 to prevent overflow -->
                  <p class="text-xs sm:text-sm text-muted-foreground mb-2">{{ step.text }}</p>
                  <div v-if="step.code" class="relative">
                    <pre class="rounded-lg bg-accent p-2 sm:p-4 overflow-x-auto text-xs sm:text-sm"><code>{{ step.code }}</code></pre>
                    <Button
                      variant="secondary"
                      size="icon"
                      class="absolute right-1 top-1 sm:right-2 sm:top-2"
                      @click="copyToClipboard(step.code || '')"
                    >
                      <Icon name="octicon:copy-16" class="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Configuration Tabs -->
        <div class="max-w-3xl mx-auto">
          <div class="flex flex-wrap items-center gap-2 mb-6 sm:mb-8 justify-center">
            <Button 
              v-for="(config, key) in configExamples"
              :key="key"
              :variant="configTabs === key ? 'default' : 'outline'"
              size="sm"
              class="text-xs sm:text-sm"
              @click="configTabs = key"
            >
              {{ config.title }}
            </Button>
          </div>

          <div class="relative rounded-xl border bg-card">
            <div class="absolute right-2 top-2 sm:right-4 sm:top-4">
              <Button
                variant="ghost"
                size="icon"
                @click="copyToClipboard(configExamples[configTabs].code)"
              >
                <Icon name="octicon:copy-16" class="w-4 h-4" />
              </Button>
            </div>
            <pre class="p-3 sm:p-6 overflow-x-auto text-xs sm:text-sm"><code>{{ configExamples[configTabs].code }}</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="relative py-24 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-tr from-primary/10 via-violet-500/10 to-background" />
      <div class="absolute inset-0 bg-grid-pattern opacity-5" />
      <div class="relative max-w-4xl mx-auto text-center px-4">
        <h2 class="text-4xl font-bold mb-6">Ready to Transform Your Workflow?</h2>
        <p class="text-xl text-muted-foreground mb-8">
          Join thousands of developers using GitHub Explorer to boost their productivity.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            class="h-14 px-8 text-lg"
          >
            <Icon name="vscode-icons:file-type-vscode" class="mr-2 h-5 w-5" />
            <a target="_blank" href="https://marketplace.visualstudio.com/items?itemName=SeanLuisGuadaRodriguez.opensource-explorer">Install Now - It's Free</a>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            class="h-14 px-8 text-lg"
            
          >
            <a target="_blank" href="https://github.com/SeanLuis/github-explorer/blob/master/vscode-extension/README.md">
              Read Documentation
            </a>
          </Button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.bg-grid-pattern {
  background-image: radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.1) 1px, transparent 0);
  background-size: 24px 24px;
}

@keyframes shimmer {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: -200% 0%;
  }
}

.animate-shimmer {
  background-size: 200% 100%;
  background-image: linear-gradient(
    to right,
    hsl(var(--primary)) 0%,
    hsl(var(--primary)) 45%,
    hsl(var(--primary)/0.8) 50%,
    hsl(var(--primary)) 55%,
    hsl(var(--primary)) 100%
  );
  animation: shimmer 2s infinite;
}

/* Añadir efecto de hover suave para las imágenes */
.group:hover img {
  transform: scale(1.01);
  transition: all 0.3s ease-in-out;
}

/* Optimizar transiciones para el masonry */
.group img {
  transition: all 0.3s ease-in-out;
}

.group:hover img {
  transform: scale(1.02);
}

pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  max-width: 100%;
  word-wrap: break-word;
  white-space: pre-wrap;
}

@media (max-width: 640px) {
  pre {
    font-size: 0.75rem;
  }
  
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }
}
</style>
