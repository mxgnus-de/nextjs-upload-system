interface HasteViewProps {
   hasteID: string;
   hasteText: string;
   language: HasteLanguage | null;
}

interface HasteLanguage {
   extension: string;
   name: string;
}

interface HasteCreateProps {
   haste?: string;
}

export type { HasteViewProps, HasteCreateProps, HasteLanguage };
