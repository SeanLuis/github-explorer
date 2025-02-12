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

export interface IGitHubLicense {
  key: string;
  name: string;
  spdx_id: string;
  url: string | null;
  node_id: string;
}

export interface IGitHubLanguageStats {
  [key: string]: number;
}

export interface IGitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: IGitHubRepository[];
}

export interface ISearchParams {
  q: string;
  sort?: SortOptions;
  order?: OrderOptions;
  per_page?: number;
  page?: number;
}

export interface IAppState {
  repositories: IGitHubRepository[];
  currentRepository: IGitHubRepository | null;
  loading: boolean;
  error: string | null;
  searchParams: ISearchParams;
  totalResults: number;
  currentPage: number;
  hasMorePages: boolean;
}

export interface IRepositoryStats {
  commitActivity: ICommitActivity[];
  codeFrequency: ICodeFrequency[];
  participation: IParticipation;
}

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

export interface IGitHubError {
  message: string;
  documentation_url?: string;
  errors?: Array<{
    resource: string;
    field: string;
    code: string;
  }>;
}

export interface IGitHubApiConfig {
  baseURL: string;
  headers: {
    Accept: string;
    Authorization?: string;
    'X-GitHub-Api-Version': string;
  };
}

export interface ICache<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

export type DataTransformer<T, R> = (data: T) => R;

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

export interface ITopicInfo {
  name: string;
  description: string;
  featured: boolean;
  icon?: string;
  gradient?: string;
  count?: number;
}