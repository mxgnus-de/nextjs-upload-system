import getSupportedLanguagesMap from './getSupportedLanguagesMap';

export default function getExtensionFromLanguageName(
   languageName: string,
): string | undefined {
   switch (languageName) {
      case 'typescript':
         return '.ts';
      case 'javascript':
         return '.js';
      case 'json':
         return '.json';
      case 'html':
         return '.html';
      case 'css':
         return '.css';
      case 'markdown':
         return '.md';
      case 'plaintext':
         return '.txt';
      case 'vue':
         return '.vue';
      case 'java':
         return '.java';
      case 'python':
         return '.py';
      case 'ruby':
         return '.rb';
      case 'bash':
         return '.sh';
      case 'c':
         return '.c';
      case 'cpp':
         return '.cpp';
      case 'csharp':
         return '.cs';
      case 'go':
         return '.go';
      case 'php':
         return '.php';
      case 'perl':
         return '.pl';
      case 'powershell':
         return '.ps1';
      case 'rust':
         return '.rs';
      case 'scala':
         return '.scala';
      case 'swift':
         return '.swift';
      case 'xml':
         return '.xml';
      case 'yaml':
         return '.yaml';
      case 'sql':
         return '.sql';
      case 'json5':
         return '.json5';
      case 'coffeescript':
         return '.coffee';
      case 'kotlin':
         return '.kt';
      case 'typescriptreact':
         return '.tsx';
      case 'javascriptreact':
         return '.jsx';
   }
}
