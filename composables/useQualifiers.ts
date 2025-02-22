import type { QualifierData } from "~/types/search"

export const QUALIFIERS: QualifierData = {
  'repo:': { label: 'Repository (user/repo)', icon: 'octicon:repo-16' },
  'user:': { label: 'User', icon: 'octicon:person-16' },
  'org:': { label: 'Organization', icon: 'octicon:organization-16' },
  'in:': { label: 'Search in', icon: 'octicon:search-16' },
  'size:': { label: 'Size', icon: 'octicon:file-16' },
  'stars:': { label: 'Stars', icon: 'octicon:star-16' },
  'language:': { label: 'Language', icon: 'octicon:code-16' },
  'created:': { label: 'Created date', icon: 'octicon:calendar-16' },
  'pushed:': { label: 'Push date', icon: 'octicon:git-commit-16' },
  'topic:': { label: 'Topic', icon: 'octicon:hash-16' },
  'is:': { label: 'State', icon: 'octicon:circle-16' },
  'fork:': { label: 'Fork', icon: 'octicon:repo-forked-16' },
}

export function useQualifiers() {
  return {
    QUALIFIERS
  }
}
