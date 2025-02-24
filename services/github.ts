const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Ruby', 'PHP',
  'C', 'C++', 'C#', 'Swift', 'Kotlin', 'Rust', 'Vue', 'React', 'Angular',
  'Svelte', 'Django', 'Flask', 'Ruby on Rails', 'Laravel', 'Spring', 'HTML', 'CSS'
]

const TOPICS = [
  'web', 'api', 'cli', 'framework', 'library', 'tools',
  'database', 'machine-learning', 'devops', 'security'
]

import { 
  OrderOptions,
  type IGitHubSearchResponse, 
  type IGitHubRepository, 
  SortOptions,
  type ITopicInfo
} from '~/types'

export class GitHubService {
  private static buildSearchQuery(params: { 
    query?: string, 
    language?: string, 
    topics?: string[],
    minStars?: number,
    hasTests?: boolean,
    isTemplate?: boolean
  }): string {
    const conditions: string[] = []
    
    if (params.query?.trim()) {
      // Validar y formatear repo: queries
      const formattedQuery = params.query.trim().split(' ').map(part => {
        if (part.toLowerCase().startsWith('repo:')) {
          const repoValue = part.slice(5) // remover 'repo:'
          // Si solo se proporciona un término, tratarlo como una búsqueda general
          if (!repoValue.includes('/')) {
            return repoValue // quitar el qualifier repo: si no tiene el formato correcto
          }
        }
        return part
      }).join(' ')
      
      conditions.push(formattedQuery)
    }
    
    // Solo agregar condiciones si no están ya presentes en el query
    const query = params.query?.toLowerCase() || ''
    
    if (params.minStars && params.minStars > 0 && !query.includes('stars:')) {
      conditions.push(`stars:>=${params.minStars}`)
    }
    
    if (params.language && params.language !== 'all' && !query.includes('language:')) {
      conditions.push(`language:${params.language}`)
    }
    
    if (params.topics?.length && !query.includes('topic:')) {
      params.topics.forEach(topic => {
        conditions.push(`topic:${topic}`)
      })
    }

    if (params.hasTests && !query.includes('topic:testing')) {
      conditions.push('topic:testing')
    }

    if (params.isTemplate && !query.includes('is:template')) {
      conditions.push('is:template')
    }

    return conditions.join(' ')
  }

  static async searchRepositories(params: {
    query?: string
    language?: string
    topics?: string[]
    minStars?: number
    hasTests?: boolean
    isTemplate?: boolean
    sort?: SortOptions
    order?: OrderOptions
    page?: number
    per_page?: number
  }): Promise<IGitHubSearchResponse> {
    try {
      const query = this.buildSearchQuery(params)
      
      const searchParams = new URLSearchParams({
        q: query,
        sort: params.sort || SortOptions.STARS,
        order: params.order || OrderOptions.DESC,
        per_page: String(params.per_page || 30),
        page: String(params.page || 1)
      })

      const response = await $fetch<IGitHubSearchResponse>(
        `https://api.github.com/search/repositories?${searchParams}`,
        { 
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'Authorization': `Bearer ${useRuntimeConfig().public.githubToken}`
          }
        }
      )

      return response
    } catch (error) {
      console.error('GitHub API Error:', error)
      throw new Error('Failed to fetch repositories')
    }
  }

  static async getTrendingRepositories(): Promise<IGitHubRepository[]> {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const response = await this.searchRepositories({
      query: `created:>${oneWeekAgo.toISOString().split('T')[0]}`,
      minStars: 100,
      sort: SortOptions.STARS,
      order: OrderOptions.DESC,
      per_page: 30
    })

    return response.items
  }

  static getLanguages(): string[] {
    return LANGUAGES
  }

  static getTopics(): string[] {
    return TOPICS
  }

  static async getPopularTopics(): Promise<ITopicInfo[]> {
    return [
      {
        name: 'ai',
        description: 'Explore cutting-edge artificial intelligence projects, from machine learning frameworks to neural networks',
        featured: true,
        icon: 'carbon:machine-learning',
        gradient: 'from-purple-500/90 to-pink-500/90'
      },
      {
        name: 'web-development',
        description: 'Modern web development frameworks, tools, and libraries for building amazing web applications',
        featured: true,
        icon: 'carbon:development',
        gradient: 'from-blue-500/90 to-cyan-500/90'
      },
      {
        name: 'cloud-native',
        description: 'Tools and platforms for building scalable, resilient cloud-native applications',
        featured: true,
        icon: 'carbon:cloud-services',
        gradient: 'from-cyan-500/90 to-blue-500/90'
      },
      {
        name: 'devops',
        description: 'Automation, CI/CD, infrastructure as code, and DevOps best practices',
        featured: true,
        icon: 'carbon:deployment-pattern',
        gradient: 'from-orange-500/90 to-red-500/90'
      },
      {
        name: 'blockchain',
        description: 'Decentralized applications, smart contracts, and blockchain development tools',
        featured: true,
        icon: 'carbon:blockchain',
        gradient: 'from-green-500/90 to-emerald-500/90'
      },
      {
        name: 'mobile',
        description: 'Cross-platform frameworks and native app development tools',
        featured: true,
        icon: 'carbon:devices',
        gradient: 'from-indigo-500/90 to-purple-500/90'
      },
      {
        name: 'security',
        description: 'Security tools, penetration testing, and cybersecurity resources',
        featured: true,
        icon: 'carbon:security',
        gradient: 'from-red-500/90 to-orange-500/90'
      },
      {
        name: 'data-science',
        description: 'Data analysis, visualization, and machine learning tools',
        featured: true,
        icon: 'carbon:data-vis-1',
        gradient: 'from-yellow-500/90 to-orange-500/90'
      },
      // ... rest of topics with default gradient and icon
      {
        name: 'ui-design',
        description: 'Beautiful UI components, design systems, and frontend frameworks',
        featured: false,
        icon: 'carbon:hashtag',
        gradient: 'from-gray-500/90 to-slate-500/90'
      },
      {
        name: 'api',
        description: 'API development tools, documentation, and backend services',
        featured: false,
        icon: 'carbon:hashtag',
        gradient: 'from-gray-500/90 to-slate-500/90'
      },
      {
        name: 'testing',
        description: 'Testing frameworks and tools for quality assurance',
        featured: false,
        icon: 'carbon:hashtag',
        gradient: 'from-gray-500/90 to-slate-500/90'
      },
      {
        name: 'productivity',
        description: 'Developer tools and utilities to boost your productivity',
        featured: false,
        icon: 'carbon:hashtag',
        gradient: 'from-gray-500/90 to-slate-500/90'
      },
      {
        name: 'game-dev',
        description: 'Game engines, frameworks, and tools for game development',
        featured: false,
        icon: 'carbon:hashtag',
        gradient: 'from-gray-500/90 to-slate-500/90'
      },
      {
        name: 'iot',
        description: 'Internet of Things platforms and embedded systems development',
        featured: false,
        icon: 'carbon:hashtag',
        gradient: 'from-gray-500/90 to-slate-500/90'
      },
      {
        name: 'cli',
        description: 'Command-line tools and terminal utilities',
        featured: false,
        icon: 'carbon:hashtag',
        gradient: 'from-gray-500/90 to-slate-500/90'
      }
    ];
  }
}
