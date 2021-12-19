function generateRandomString(length: number): string {
   let value: string = '';
   for (let i = 0; i < length; i++) {
      value += 'x';
   }
   let date = new Date().getTime();
   let string = value.replace(/[xy]/g, function (c) {
      let r = (date + Math.random() * 16) % 16 | 0;
      date = Math.floor(date / 16);
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
   });

   return string;
}

export { generateRandomString };
