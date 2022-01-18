module.exports = {
   apps: [
      {
         name: 'upload-system',
         script: './dist/server/index.js',
         env: {
            NODE_ENV: 'production',
         },
      },
   ],
};
