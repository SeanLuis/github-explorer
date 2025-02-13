<script setup lang="ts">
import { useGithubStore } from '~/stores/github'
import type { IGitHubRepository } from '~/types'
import { getGradientFromString } from '~/utils/gradients'

// Agregar esta importación
import { defineWebPage } from '#imports'

const route = useRoute()
const router = useRouter()
const store = useGithubStore()
const repository = ref<IGitHubRepository | null>(null)

onMounted(async () => {
  const [owner, name] = (route.params.slug as string[]) || []
  if (!owner || !name) {
    router.push('/')
    return
  }

  try {
    const repo = await store.getRepositoryDetails(`${owner}/${name}`)
    repository.value = repo
  } catch (error) {
    console.error('Error loading repository:', error)
  }
})

const formattedDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const languageColors = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Java: '#b07219',
  Go: '#00ADD8',
  Ruby: '#701516',
  PHP: '#4F5D95',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Swift: '#ffac45',
  Kotlin: '#F18E33',
  Rust: '#dea584',
  Vue: '#41b883',
  React: '#61dafb',
  Angular: '#dd1b16',
  Svelte: '#ff3e00',
  Django: '#092e20',
  Flask: '#000000',
  'Ruby on Rails': '#CC0000',
  Laravel: '#FF2D20',
  Spring: '#6DB33F'
}

const repoStats = computed(() => [
  {
    label: 'Stars',
    value: repository.value?.stargazers_count,
    icon: 'octicon:star-16',
    url: `${repository.value?.html_url}/stargazers`,
    description: 'GitHub users who starred this repository'
  },
  {
    label: 'Forks',
    value: repository.value?.forks_count,
    icon: 'octicon:repo-forked-16',
    url: `${repository.value?.html_url}/network/members`,
    description: 'Copies of this repository'
  },
  {
    label: 'Open Issues',
    value: repository.value?.open_issues_count,
    icon: 'octicon:issue-opened-16',
    url: `${repository.value?.html_url}/issues`,
    description: 'Issues needing attention'
  },
  {
    label: 'Pull Requests',
    value: repository.value?.open_issues_count,
    icon: 'octicon:git-pull-request-16',
    url: `${repository.value?.html_url}/pulls`,
    description: 'Proposed changes to this repository'
  }
])

const metaInfo = computed(() => [
  {
    label: 'Created',
    value: formattedDate(repository.value?.created_at || ''),
    icon: 'octicon:clock-16'
  },
  {
    label: 'Last Updated',
    value: formattedDate(repository.value?.updated_at || ''),
    icon: 'octicon:sync-16'
  },
  {
    label: 'License',
    value: repository.value?.license?.name || 'Not specified',
    icon: 'octicon:law-16'
  }
])

const headerGradient = computed(() => {
  if (!repository.value) return ''
  return getGradientFromString(`${repository.value.owner.login}/${repository.value.name}`)
})

const getTextColor = computed(() => {
  return 'text-white dark:text-white'
})

const getBackgroundOverlay = computed(() => {
  return 'bg-black/20 dark:bg-black/40'
})

// Modificar el watch para usar defineWebPage en lugar de defineSoftwareSourceCode
watch(repository, (repo) => {
  if (repo) {
    useSchemaOrg([
      defineWebPage({
        '@type': 'SoftwareSourceCode',
        name: repo.name,
        description: repo.description,
        version: repo.default_branch,
        dateCreated: repo.created_at,
        dateModified: repo.updated_at,
        programmingLanguage: repo.language,
        codeRepository: repo.html_url,
        author: {
          '@type': 'Person',
          name: repo.owner.login,
          url: repo.owner.html_url
        }
      })
    ])

    // Meta tags dinámicos
    useSeoMeta({
      title: `${repo.name} - GitHub Open Source Explorer`,
      description: repo.description,
      ogTitle: `${repo.name} - Open Source Repository`,
      ogDescription: repo.description,
      ogImage: repo.owner.avatar_url,
      twitterCard: 'summary_large_image',
    })
  }
})
</script>

<template>
  <div v-if="repository" class="min-h-screen">
    <div 
      class="relative -mx-6 -mt-6 px-6 py-16 mb-6 overflow-hidden"
      :class="['bg-gradient-to-br', headerGradient]"
    >
      <div :class="['absolute inset-0', getBackgroundOverlay]" />
      
      <div class="absolute inset-0 bg-grid-pattern opacity-10" />
      
      <div class="container relative">
        <div class="mb-8">
          <div class="flex items-center gap-2 text-sm mb-4">
            <NuxtLink 
              :to="`https://github.com/${repository.owner.login}`"
              target="_blank"
              class="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <img 
                :src="repository.owner.avatar_url" 
                :alt="repository.owner.login"
                class="w-6 h-6 rounded-full ring-2 ring-white/20"
              />
              {{ repository.owner.login }}
            </NuxtLink>
            <Icon name="octicon:chevron-right-16" class="h-4 w-4 text-white/60" />
            <h1 class="font-semibold text-white">{{ repository.name }}</h1>
          </div>

          <div class="max-w-3xl mx-auto text-center">
            <h1 class="text-4xl font-bold tracking-tight mb-4 text-white">
              {{ repository.name }}
              <Badge v-if="repository.private" class="bg-white/10 text-white hover:bg-white/20">
                Private
              </Badge>
              <Badge v-else class="bg-emerald-400/20 text-emerald-100 hover:bg-emerald-400/30">
                Public
              </Badge>
            </h1>
            
            <p class="text-xl text-white/80 mb-8">
              {{ repository.description }}
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              v-for="stat in repoStats"
              :key="stat.label"
              variant="outline"
              class="h-auto p-4 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group backdrop-blur-sm"
              @click="navigateTo(stat.url)"
            >
              <div class="text-left space-y-2 w-full">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-white/60">
                    {{ stat.label }}
                  </span>
                  <Icon 
                    :name="stat.icon" 
                    class="h-4 w-4 text-white/60 group-hover:text-white transition-colors" 
                  />
                </div>
                <p class="text-2xl font-bold text-white group-hover:text-white transition-colors">
                  {{ stat.value?.toLocaleString() }}
                </p>
                <p class="text-xs text-white/60">
                  {{ stat.description }}
                </p>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Icon name="octicon:book-16" class="h-5 w-5" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <p class="text-sm text-muted-foreground">Created</p>
                  <p>{{ formattedDate(repository.created_at) }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm text-muted-foreground">Last Updated</p>
                  <p>{{ formattedDate(repository.updated_at) }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm text-muted-foreground">Primary Language</p>
                  <p class="flex items-center gap-2">
                    <span 
                      class="w-3 h-3 rounded-full"
                      :style="`background-color: ${repository.language}`"
                    />
                    {{ repository.language || 'Not specified' }}
                  </p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm text-muted-foreground">License</p>
                  <p>{{ repository.license?.name || 'Not specified' }}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Icon name="octicon:file-16" class="h-5 w-5" />
                README.md
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-muted-foreground">README content coming soon...</p>
            </CardContent>
          </Card>
        </div>

        <div class="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-2">
                <Button 
                  variant="outline" 
                  class="w-full justify-start gap-2"
                  as="a"
                  :href="repository.html_url"
                  target="_blank"
                >
                  <Icon name="octicon:mark-github-16" class="h-4 w-4" />
                  View on GitHub
                </Button>
                
                <Button 
                  v-if="repository.homepage"
                  variant="outline"
                  class="w-full justify-start gap-2"
                  as="a"
                  :href="repository.homepage"
                  target="_blank"
                >
                  <Icon name="octicon:link-external-16" class="h-4 w-4" />
                  Homepage
                </Button>

                <Button
                  variant="outline"
                  class="w-full justify-start gap-2"
                  as="a"
                  :href="`${repository.html_url}/issues`"
                  target="_blank"
                >
                  <Icon name="octicon:issue-opened-16" class="h-4 w-4" />
                  Issues
                </Button>

                <Button
                  variant="outline"
                  class="w-full justify-start gap-2"
                  as="a"
                  :href="`${repository.html_url}/pulls`"
                  target="_blank"
                >
                  <Icon name="octicon:git-pull-request-16" class="h-4 w-4" />
                  Pull Requests
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-muted-foreground">Language breakdown coming soon...</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-muted-foreground">Contributors list coming soon...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex justify-center items-center min-h-[50vh]">
    <div class="flex items-center gap-2">
      <div class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      <span>Loading repository details...</span>
    </div>
  </div>
</template>
