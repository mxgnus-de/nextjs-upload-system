import path from 'path';

const paths = {
   upload: path.resolve('.', 'uploads'),
   image: path.resolve('.', 'uploads', 'images'),
   video: path.resolve('.', 'uploads', 'videos'),
   audio: path.resolve('.', 'uploads', 'audios'),
   data: path.resolve('.', 'uploads', 'data'),
};

/* Secret Upload keys */
const keys: string[] = [''];

export { paths, keys };
