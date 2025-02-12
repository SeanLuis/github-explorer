// types/github.ts

// Interfaz principal para los repositorios
export interface IGitHubRepository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: IGitHubUser;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  master_branch?: string;
  default_branch: string;
  score: number;
  archived: boolean;
  disabled: boolean;
  license: IGitHubLicense | null;
  topics: string[];
  visibility: string;
  forks: number;
  watchers: number;
  network_count?: number;
  subscribers_count?: number;
}

// Interfaz para usuarios/organizaciones
export interface IGitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: 'User' | 'Organization';
  site_admin: boolean;
}

// Interfaz para licencias
export interface IGitHubLicense {
  key: string;
  name: string;
  spdx_id: string;
  url: string | null;
  node_id: string;
}

// Interfaz para estadísticas de código
export interface IGitHubLanguageStats {
  [key: string]: number;
}

// Interfaz para la respuesta de búsqueda
export interface IGitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: IGitHubRepository[];
}

// Interfaz para los parámetros de búsqueda
export interface ISearchParams {
  q: string;
  sort?: 'stars' | 'forks' | 'help-wanted-issues' | 'updated';
  order?: 'desc' | 'asc';
  per_page?: number;
  page?: number;
}

// Interfaz para el estado de la aplicación
export interface IAppState {
  repositories: IGitHubRepository[];
  currentRepository: IGitHubRepository | null;
  loading: boolean;
  error: string | null;
  searchParams: ISearchParams;
  totalResults: number;
  currentPage: number;
}

// Interfaz para las estadísticas del repositorio
export interface IRepositoryStats {
  commitActivity: ICommitActivity[];
  codeFrequency: ICodeFrequency[];
  participation: IParticipation;
}

// Interfaces para estadísticas detalladas
export interface ICommitActivity {
  days: number[];
  total: number;
  week: number;
}

export interface ICodeFrequency {
  week: number;
  additions: number;
  deletions: number;
}

export interface IParticipation {
  all: number[];
  owner: number[];
}

// Enums para filtros y ordenamiento
export enum SortOptions {
  STARS = 'stars',
  FORKS = 'forks',
  UPDATED = 'updated',
  HELP_WANTED = 'help-wanted-issues'
}

export enum OrderOptions {
  DESC = 'desc',
  ASC = 'asc'
}

// Tipos para las respuestas de error
export interface IGitHubError {
  message: string;
  documentation_url?: string;
  errors?: Array<{
    resource: string;
    field: string;
    code: string;
  }>;
}

// Interfaz para la configuración de la API
export interface IGitHubApiConfig {
  baseURL: string;
  headers: {
    Accept: string;
    Authorization?: string;
    'X-GitHub-Api-Version': string;
  };
}

// Interfaz para la caché
export interface ICache<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

// Tipo para las funciones de transformación de datos
export type DataTransformer<T, R> = (data: T) => R;

// Interfaz para los filtros avanzados
export interface IAdvancedFilters {
  language?: string;
  minStars?: number;
  maxStars?: number;
  createdAfter?: Date;
  createdBefore?: Date;
  hasTopics?: string[];
  hasLicense?: boolean;
  isTemplate?: boolean;
  isFork?: boolean;
  isArchived?: boolean;
}