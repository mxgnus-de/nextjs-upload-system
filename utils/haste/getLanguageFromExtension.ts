import getSupportedLanguagesMap from './getSupportedLanguagesMap';

export default function getLanguageFromExtension(
   ext: string,
): string | undefined {
   const supportedLanguagesMap = getSupportedLanguagesMap();
   return supportedLanguagesMap.get(ext);
}
