export interface SearchToken {
  type: 'qualifier' | 'text' | 'space';
  value: string;
  qualifier?: string;
}

export interface QualifierInfo {
  label: string;
  icon: string;
}

export interface QualifierData {
  [key: string]: QualifierInfo;
}

export interface SuggestionItem {
  qualifier: string;
  isUsed: boolean;
  value?: string;
}

export interface ColoredPart {
  text: string;
  type: 'qualifier' | 'value' | 'normal';
}
