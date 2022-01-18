const devenv = process.env.NODE_ENV !== 'development';

const server = devenv ? 'http://localhost:3000' : 'https://domain.tld';
const port = 3000;

const serverdomain = devenv ? 'localhost' : 'domain.tld';

export { server, serverdomain, devenv };
