import path from 'path';

const paths = {
   upload: path.resolve('.', 'public', 'uploads'),
   image: path.resolve('.', 'public', 'uploads', 'images'),
   video: path.resolve('.', 'public', 'uploads', 'videos'),
   audio: path.resolve('.', 'public', 'uploads', 'audio'),
   data: path.resolve('.', 'public', 'uploads', 'data'),
};

export { paths };
