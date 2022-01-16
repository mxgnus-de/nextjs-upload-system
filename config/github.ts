import path from 'path';

const githubrepourl = 'https://github.com/mxgnus-de/nextjs-upload-system';
const githubapirepourl: string =
   'https://api.github.com/repos/mxgnus-de/nextjs-upload-system';
const githubrepopackageJSON: string =
   'https://raw.githubusercontent.com/mxgnus-de/nextjs-upload-system/master/package.json';
const localpackageJSON: string = path.resolve('.', 'package.json');

export {
   githubapirepourl,
   githubrepopackageJSON,
   localpackageJSON,
   githubrepourl,
};
