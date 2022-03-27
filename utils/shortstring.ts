export default function shortString(name: string, maxSize: number): string {
   let shortedName = name;
   for (let i = 0; i < name.length; i++) {
      if (i === maxSize) {
         shortedName = name.slice(0, i) + '...';
         break;
      }
   }
   return shortedName;
}
