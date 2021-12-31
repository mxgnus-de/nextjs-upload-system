import path from 'path';

const githubrepourl = 'https://github.com/mags007/nextjs-upload-system';
const githubapirepourl: string =
   'https://api.github.com/repos/mags007/nextjs-upload-system';
const githubrepopackageJSON: string =
   'https://raw.githubusercontent.com/Mags007/nextjs-upload-system/master/package.json';
const localpackageJSON: string = path.resolve('.', 'package.json');

export {
   githubapirepourl,
   githubrepopackageJSON,
   localpackageJSON,
   githubrepourl,
};
