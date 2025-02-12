import { SortOptions, type IGitHubRepository } from '~/types'
import { GitHubService } from './github';

export interface ICollection {
  id: CollectionId;
  title: string;
  description: string;
  icon: string;
  repos: IGitHubRepository[];
}

type CollectionId = 
  | 'developer-tools'
  | 'web-frameworks'
  | 'mobile-frameworks'
  | 'data-science'
  | 'devops-tools'
  | 'game-engines'
  | 'ui-libraries'
  | 'backend-frameworks'
  | 'databases'
  | 'testing-tools'
  | 'ai-frameworks'
  | 'ai-llm-tools'
  | 'ai-vision'
  | 'ai-agents'
  | 'ai-chatbots';

export class CollectionService {
  static async generateCollections(): Promise<ICollection[]> {
    const collections: ICollection[] = [
      {
        id: 'developer-tools',
        title: 'Must-have Developer Tools',
        description: 'Essential tools and utilities for modern development',
        icon: 'octicon:tools-24',
        repos: []
      },
      {
        id: 'web-frameworks',
        title: 'Web Development Frameworks',
        description: 'Popular frameworks for building web applications',
        icon: 'octicon:browser-24',
        repos: []
      },
      {
        id: 'mobile-frameworks',
        title: 'Mobile Development Frameworks',
        description: 'Top frameworks for building mobile applications',
        icon: 'octicon:device-mobile-24',
        repos: []
      },
      {
        id: 'data-science',
        title: 'Data Science & ML',
        description: 'Popular tools for data science and machine learning',
        icon: 'octicon:graph-24',
        repos: []
      },
      {
        id: 'devops-tools',
        title: 'DevOps & Infrastructure',
        description: 'Essential tools for DevOps and infrastructure management',
        icon: 'octicon:server-24',
        repos: []
      },
      {
        id: 'game-engines',
        title: 'Game Development',
        description: 'Leading game engines and development tools',
        icon: 'octicon:play-24',
        repos: []
      },
      {
        id: 'ui-libraries',
        title: 'UI Component Libraries',
        description: 'Popular UI component libraries and design systems',
        icon: 'octicon:paintbrush-24',
        repos: []
      },
      {
        id: 'backend-frameworks',
        title: 'Backend Frameworks',
        description: 'Powerful frameworks for building backend services',
        icon: 'octicon:server-24',
        repos: []
      },
      {
        id: 'databases',
        title: 'Database Systems',
        description: 'Modern database systems and tools',
        icon: 'octicon:database-24',
        repos: []
      },
      {
        id: 'testing-tools',
        title: 'Testing Tools',
        description: 'Popular testing frameworks and utilities',
        icon: 'octicon:checklist-24',
        repos: []
      },
      {
        id: 'ai-frameworks',
        title: 'AI & Deep Learning Frameworks',
        description: 'Popular frameworks for building AI and deep learning applications',
        icon: 'octicon:cpu-24',
        repos: []
      },
      {
        id: 'ai-llm-tools',
        title: 'LLM & Foundation Models',
        description: 'Tools and libraries for working with Large Language Models',
        icon: 'octicon:repo-template-24',
        repos: []
      },
      {
        id: 'ai-vision',
        title: 'Computer Vision & Image AI',
        description: 'Tools for computer vision and image processing with AI',
        icon: 'octicon:eye-24',
        repos: []
      },
      {
        id: 'ai-agents',
        title: 'AI Agents & Automation',
        description: 'Frameworks and tools for building AI agents and automation',
        icon: 'octicon:copilot-24',
        repos: []
      },
      {
        id: 'ai-chatbots',
        title: 'Chatbots & Conversational AI',
        description: 'Tools for building intelligent chatbots and conversational interfaces',
        icon: 'octicon:comment-discussion-24',
        repos: []
      }
    ];

    await Promise.all(
      collections.map(async (collection) => {
        const response = await GitHubService.searchRepositories({
          query: this.getQueryForCollection(collection.id),
          sort: SortOptions.STARS,
          per_page: 5
        });
        collection.repos = response.items;
      })
    );

    return collections;
  }

  private static getQueryForCollection(collectionId: CollectionId): string {
    const queries: Record<CollectionId, string> = {
      'developer-tools': 'topic:developer-tools stars:>1000',
      'web-frameworks': 'topic:web-framework stars:>5000',
      'mobile-frameworks': 'topic:mobile-framework stars:>3000',
      'data-science': 'topic:data-science stars:>5000',
      'devops-tools': 'topic:devops stars:>3000',
      'game-engines': 'topic:game-engine stars:>1000',
      'ui-libraries': 'topic:ui-library stars:>2000',
      'backend-frameworks': 'topic:backend-framework stars:>3000',
      'databases': 'topic:database stars:>5000',
      'testing-tools': 'topic:testing-framework stars:>1000',
      'ai-frameworks': 'topic:artificial-intelligence stars:>1000 topic:deep-learning',
      'ai-llm-tools': 'topic:llm stars:>100 created:>2022-01-01',
      'ai-vision': 'topic:computer-vision stars:>500',
      'ai-agents': 'topic:ai-agents stars:>100 created:>2022-01-01',
      'ai-chatbots': 'topic:chatbot stars:>500 topic:ai'
    };

    return queries[collectionId];
  }
}
