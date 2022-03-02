import { File, Haste, Shorter } from '@prisma/client';

export interface FileOwner extends File {
   ownerName: string | null;
}

export interface ShorterOwner extends Shorter {
   ownerName: string | null;
}

export interface HasteOwner extends Haste {
   ownerName: string | null;
}
