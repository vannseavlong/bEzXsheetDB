/**
 * Language utility functions for handling multi-language content
 */

import type { TaskInfoAttributes } from '@/types/api';

export type MultiLanguageName = {
  nameEn?: string;
  nameKm?: string;
  nameVi?: string;
  nameCn?: string;
  nameTw?: string;
};

export type MultiLanguageInfo = {
  infoEn?: string;
  infoKm?: string;
  infoVi?: string;
  infoCn?: string;
  infoTw?: string;
};

export type MultiLanguageTaskInfo = {
  taskInfoEn?: TaskInfoAttributes[];
  taskInfoKm?: TaskInfoAttributes[];
  taskInfoVi?: TaskInfoAttributes[];
  taskInfoCn?: TaskInfoAttributes[];
  taskInfoTw?: TaskInfoAttributes[];
};

export type MultiLanguageContent = MultiLanguageName &
  MultiLanguageInfo &
  MultiLanguageTaskInfo &
  Record<string, unknown>;

type LanguageKey = 'en' | 'km' | 'vi' | 'cn' | 'tw';

const LANGUAGE_ALIASES: Record<string, LanguageKey> = {
  kh: 'km',
  zh: 'cn'
};

const NAME_KEYS: Record<LanguageKey, keyof MultiLanguageContent> = {
  en: 'nameEn',
  km: 'nameKm',
  vi: 'nameVi',
  cn: 'nameCn',
  tw: 'nameTw'
};

const INFO_KEYS: Record<LanguageKey, keyof MultiLanguageContent> = {
  en: 'infoEn',
  km: 'infoKm',
  vi: 'infoVi',
  cn: 'infoCn',
  tw: 'infoTw'
};

const TASK_INFO_KEYS: Record<LanguageKey, keyof MultiLanguageContent> = {
  en: 'taskInfoEn',
  km: 'taskInfoKm',
  vi: 'taskInfoVi',
  cn: 'taskInfoCn',
  tw: 'taskInfoTw'
};

const VALID_LANGUAGES: LanguageKey[] = ['en', 'km', 'vi', 'cn', 'tw'];

const normalizeLanguage = (lang: string): LanguageKey => {
  const normalized = lang.toLowerCase();
  const key = LANGUAGE_ALIASES[normalized] || (normalized as LanguageKey);
  return VALID_LANGUAGES.includes(key) ? key : 'en';
};

/**
 * Get localized name based on current language
 */
export const getLocalizedName = (content: MultiLanguageContent, language: string): string => {
  const lang = normalizeLanguage(language);
  const key = NAME_KEYS[lang];
  const value = content[key];
  return typeof value === 'string' ? value : content.nameEn || '';
};

/**
 * Get localized info/description based on current language
 */
export const getLocalizedInfo = (content: MultiLanguageContent, language: string): string => {
  const lang = normalizeLanguage(language);
  const key = INFO_KEYS[lang];
  const value = content[key];
  return typeof value === 'string' ? value : content.infoEn || '';
};

/**
 * Get localized task info based on current language
 */
export const getLocalizedTaskInfo = (
  content: MultiLanguageContent,
  language: string
): TaskInfoAttributes[] => {
  const lang = normalizeLanguage(language);
  const key = TASK_INFO_KEYS[lang];
  const value = content[key];
  return Array.isArray(value) ? value : content.taskInfoEn || [];
};
