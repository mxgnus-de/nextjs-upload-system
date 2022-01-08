import axiosClient from 'api/axiosClient';
import { githubrepopackageJSON, localpackageJSON } from 'config/github';
import { readFileSync } from 'fs';

async function isVersionUpToDate(): Promise<boolean> {
   const githubPackageJSON = await axiosClient
      .get(githubrepopackageJSON)
      .catch(() => {});
   const localpackage = JSON.parse(readFileSync(localpackageJSON, 'utf8'));
   const localversion: boolean = localpackage.version;
   const githubversion: boolean = githubPackageJSON.data.version;
   return localversion === githubversion;
}

export { isVersionUpToDate };
