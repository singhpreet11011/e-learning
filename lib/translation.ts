import axios from 'axios';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

interface TranslateOptions {
  text: string;
  targetLanguage: LanguageCode;
  sourceLanguage?: LanguageCode;
}

interface BatchTranslateOptions {
  texts: string[];
  targetLanguage: LanguageCode;
  sourceLanguage?: LanguageCode;
}

class TranslationService {
  private apiKey: string;
  private baseUrl = 'https://translation.googleapis.com/language/translate/v2';
  private cache: Map<string, string> = new Map();

  constructor() {
    this.apiKey = process.env.GOOGLE_TRANSLATE_API_KEY || '';
  }

  private getCacheKey(text: string, targetLang: string): string {
    return `${targetLang}:${text}`;
  }

  async translateText({ text, targetLanguage, sourceLanguage = 'en' }: TranslateOptions): Promise<string> {
    if (!this.apiKey) {
      console.warn('Google Translate API key not configured. Returning original text.');
      return text;
    }

    if (!text || text.trim() === '') {
      return text;
    }

    if (sourceLanguage === targetLanguage) {
      return text;
    }

    // Check cache
    const cacheKey = this.getCacheKey(text, targetLanguage);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const response = await axios.post(
        this.baseUrl,
        {
          q: text,
          target: targetLanguage,
          source: sourceLanguage,
          format: 'text',
        },
        {
          params: {
            key: this.apiKey,
          },
        }
      );

      const translatedText = response.data.data.translations[0].translatedText;
      
      // Cache the result
      this.cache.set(cacheKey, translatedText);
      
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text on error
    }
  }

  async translateBatch({ texts, targetLanguage, sourceLanguage = 'en' }: BatchTranslateOptions): Promise<string[]> {
    if (!this.apiKey) {
      console.warn('Google Translate API key not configured. Returning original texts.');
      return texts;
    }

    if (sourceLanguage === targetLanguage) {
      return texts;
    }

    // Filter out already cached translations
    const uncachedTexts: string[] = [];
    const results: (string | null)[] = [];

    texts.forEach((text, index) => {
      const cacheKey = this.getCacheKey(text, targetLanguage);
      if (this.cache.has(cacheKey)) {
        results[index] = this.cache.get(cacheKey)!;
      } else {
        results[index] = null;
        uncachedTexts.push(text);
      }
    });

    if (uncachedTexts.length === 0) {
      return results as string[];
    }

    try {
      const response = await axios.post(
        this.baseUrl,
        {
          q: uncachedTexts,
          target: targetLanguage,
          source: sourceLanguage,
          format: 'text',
        },
        {
          params: {
            key: this.apiKey,
          },
        }
      );

      const translations = response.data.data.translations.map((t: any) => t.translatedText);
      
      // Cache and insert translations
      let translationIndex = 0;
      results.forEach((result, index) => {
        if (result === null) {
          const translatedText = translations[translationIndex++];
          const cacheKey = this.getCacheKey(texts[index], targetLanguage);
          this.cache.set(cacheKey, translatedText);
          results[index] = translatedText;
        }
      });

      return results as string[];
    } catch (error) {
      console.error('Batch translation error:', error);
      return texts; // Return original texts on error
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

export const translationService = new TranslationService();

// Helper function for client-side translation via API route
export async function translateOnClient(
  text: string,
  targetLanguage: LanguageCode,
  sourceLanguage: LanguageCode = 'en'
): Promise<string> {
  if (sourceLanguage === targetLanguage) {
    return text;
  }

  try {
    const response = await axios.post('/api/translate', {
      text,
      targetLanguage,
      sourceLanguage,
    });
    return response.data.translatedText;
  } catch (error) {
    console.error('Client translation error:', error);
    return text;
  }
}

// Helper function for batch translation on client
export async function batchTranslateOnClient(
  texts: string[],
  targetLanguage: LanguageCode,
  sourceLanguage: LanguageCode = 'en'
): Promise<string[]> {
  if (sourceLanguage === targetLanguage) {
    return texts;
  }

  try {
    const response = await axios.post('/api/translate/batch', {
      texts,
      targetLanguage,
      sourceLanguage,
    });
    return response.data.translatedTexts;
  } catch (error) {
    console.error('Client batch translation error:', error);
    return texts;
  }
}
