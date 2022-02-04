import path from 'path';
import fs from 'fs';

export default function getSupportedLanguagesMap(): Map<string, string> {
   const supportedlanguagespath = path.resolve(
      '.',
      'data',
      'haste',
      'supportedlanguages.json',
   );
   const supportedlanguages = JSON.parse(
      fs.readFileSync(supportedlanguagespath, 'utf-8'),
   );
   const supportedLanguagesKeys = Object.keys(supportedlanguages);
   const supportedLanguagesMap = new Map();
   supportedLanguagesKeys.forEach((key) => {
      supportedLanguagesMap.set(key, supportedlanguages[key]);
   });
   return supportedLanguagesMap;
}
