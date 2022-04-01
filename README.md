[![wakatime](https://wakatime.com/badge/github/mxgnus-de/nextjs-upload-system.svg)](https://wakatime.com/badge/github/mxgnus-de/nextjs-upload-system)

# Author

### mxgnus-de

<ul>
   <li><a href="mailto:kontakt@mxgnus.de">Email</a></li>
   <li><a href="https://github.com/mxgnus-de">Github</a>
   <li><a href="https://discord.com/users/666974190561394698">Discord</a>
</ul>

# Setup the project

### 1) Clone the repository

```bash
 $ git clone https://github.com/mxgnus-de/nextjs-upload-system.git && cd nextjs-upload-system
```

### 2) Install all dependencies

```bash
$ npm install
```

### 3) Configure the files in the `config` directory and remove the suffix `_template` from the files

### 4) Rename the `.env.example` file to `.env` and fill in the values

### 5) Build the production version of the project

```bash
$ npm run build
```

### 6) Start the production version of the project

#### INFO: You need [pm2](https://www.npmjs.com/package/pm2) installed to start the project the production version (run `npm install pm2 -g`)

```bash
$ npm start:production
```

### 7) Default login

The default uploadkey is `changeme`.

If you login the first time, the uploadkey will be automatically changed.

# Configuration

<ul>
   <li>All configuration files can be found in the `config` directory.</li>
   <li>Save the configuration file in the `config` without the _template suffix.</li>
   <li>You can change the favicon.ico in the `public` directory.</li>
</ul>

# Informations about the project

<ul>
   <li>Build with <a href='https://nextjs.org/'>NextJS</a> and <a href='https://reactjs.org/'>React</a></li>
</ul>
