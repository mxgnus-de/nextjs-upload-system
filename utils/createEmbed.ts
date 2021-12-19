export default class Embed {
   private title?: string;
   private color?: number;
   private description?: string;
   private id: number;
   constructor(
      id: number,
      title?: string,
      color?: number,
      description?: string,
   ) {
      this.id = id;
      this.title = title;
      this.color = color;
      this.description = description;
   }
   get getTitle() {
      return this.title;
   }
   get getColor() {
      return this.color;
   }
   get getDescription() {
      return this.description;
   }

   public build() {
      return {
         color: this.getColor,
         title: this.getTitle,
         description: this.getDescription,
      };
   }
}
