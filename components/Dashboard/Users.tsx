import axiosClient from 'api/axiosClient';
import { AxiosError, AxiosResponse } from 'axios';
import { useErrorWidgitUpdate } from 'components/Context/ErrorWidgitContext';
import { useSuccessWidgitUpdate } from 'components/Context/SuccessWidgitContext';
import { server } from 'config/api';
import { User as IUser } from 'types/Dashboard';
import { useCookies } from 'react-cookie';
import DashboardButtons from './DashboardButtons';
import DashboardName from './DashboardName';
import DashboardItemWrapper from './DashboardItemWrapper';

function Users({ users, setUsers }: { users: IUser[]; setUsers: any }) {
   const updateSuccessWidgit = useSuccessWidgitUpdate();
   const updateErrorWidgit = useErrorWidgitUpdate();

   function createUser() {
      let username = window.prompt('Username:');
      if (username) {
         axiosClient
            .post(`${server}/api/dashboard/users`, {
               username,
            })
            .then(({ data }) => {
               setUsers((prev: any) => [
                  ...prev,
                  { key: data.uploadkey, username: data.username },
               ]);
               updateSuccessWidgit?.showSuccessWidgit(
                  'User created with username ' + username,
               );
            })
            .catch((err: AxiosError) => {
               updateErrorWidgit?.showErrorWidgit(
                  err.message + ': ' + err.response?.statusText,
               );
            });
      } else {
         return updateSuccessWidgit?.showSuccessWidgit(
            'User creation cancelled',
         );
      }
   }

   return (
      <>
         {users?.length ? (
            users.map((user, index) => {
               return (
                  <User
                     key={index}
                     username={user.username}
                     setUsers={setUsers}
                     uploadkey={user.key}
                  />
               );
            })
         ) : (
            <>
               <h4 style={{ margin: '10px' }}>No users created yet</h4>
            </>
         )}
         <button
            className='button button-blue'
            style={{ margin: '10px' }}
            onClick={createUser}
         >
            Create Create user
         </button>
      </>
   );
}

function User(user: { username: string; uploadkey: string; setUsers: any }) {
   const updateSuccessWidgit = useSuccessWidgitUpdate();
   const updateErrorWidgit = useErrorWidgitUpdate();
   const [cookies, setCookies, removeCookies] = useCookies(['upload_key']);

   function deleteUser(uploadkey: string) {
      const confirm = window.confirm(
         `Are you sure you want to delete ${user.username}?`,
      );

      if (confirm) {
         axiosClient
            .delete(`/api/dashboard/users?upload_key=${uploadkey}`)
            .then(async () => {
               updateSuccessWidgit?.showSuccessWidgit(
                  `${user.username} deleted`,
               );
               const shortURLs = await axiosClient.get(
                  server + '/api/dashboard/users',
                  {
                     withCredentials: true,
                  },
               );
               if (shortURLs.data) {
                  user.setUsers(shortURLs.data);
               }
            })
            .catch((error: AxiosError) => {
               updateErrorWidgit?.showErrorWidgit(
                  error.message + ': ' + error.response?.statusText,
               );
            });
      } else {
         return updateSuccessWidgit?.showSuccessWidgit('Cancelled');
      }
   }

   function copieUploadkey() {
      if (navigator.clipboard) {
         navigator.clipboard.writeText(user.uploadkey);
         updateSuccessWidgit?.showSuccessWidgit('Upload key copied');
      }
   }

   function changeUploadkey() {
      const confirm = window.confirm(
         `Are you sure you want to change ${user.username}'s upload key?`,
      );

      if (confirm) {
         axiosClient
            .put(
               `/api/dashboard/users?upload_key=${user.uploadkey}&action=changekey`,
            )
            .then((res) => {
               updateSuccessWidgit?.showSuccessWidgit(
                  `${user.username}'s upload key changed`,
               );
               if (navigator.clipboard) {
                  navigator.clipboard.writeText(res.data.newuploadkey);
                  updateSuccessWidgit?.showSuccessWidgit('Upload key copied');
               }
               alert('New upload key:\n' + res.data.newuploadkey);
               if (cookies['upload_key'] === user.uploadkey) {
                  setCookies('upload_key', res.data.newuploadkey, {
                     path: '/',
                  });
               }
               axiosClient
                  .get(server + '/api/dashboard/users', {
                     withCredentials: true,
                  })
                  .catch(() => {})
                  .then((res) => {
                     if (res?.data) {
                        user.setUsers(res.data);
                     }
                  });
            })
            .catch((error: AxiosError) => {
               updateErrorWidgit?.showErrorWidgit(
                  error.message + ': ' + error.response?.statusText,
               );
            });
      } else {
         return updateSuccessWidgit?.showSuccessWidgit('Cancelled');
      }
   }

   function changeUsername() {
      const newUsername = window.prompt('New username:');
      if (newUsername) {
         axiosClient
            .put(server + '/api/dashboard/users?action=changeusername', {
               newusername: newUsername,
            })
            .catch((error: AxiosError) => {
               updateErrorWidgit?.showErrorWidgit(
                  error.message + ': ' + error.response?.statusText,
               );
            })
            .then((res: any) => {
               if (res?.data?.newusername) {
                  user.setUsers((prev: IUser[]) => {
                     const newusers: IUser[] = [];
                     prev.forEach((item: IUser) => {
                        if (item.key !== user.uploadkey) {
                           newusers.push(item);
                        } else {
                           newusers.push({
                              key: item.key,
                              username: res.data.newusername,
                           });
                        }
                     });
                     return newusers;
                  });
                  updateSuccessWidgit?.showSuccessWidgit(
                     `${user.username}'s username changed to ${res.data.newusername}`,
                  );
               } else {
                  updateErrorWidgit?.showErrorWidgit(
                     'Could not change username',
                  );
               }
            });
      } else {
         return updateSuccessWidgit?.showSuccessWidgit('Cancelled');
      }
   }

   return (
      <DashboardItemWrapper>
         <DashboardName>
            {user.username}
            {cookies['upload_key'] === user.uploadkey && (
               <span className='ml-10 color-green-light'>You</span>
            )}
         </DashboardName>

         <DashboardButtons>
            <button
               className='button button-green'
               onClick={() => copieUploadkey()}
            >
               Copie uploadkey
            </button>
            <button
               className='button button-blue'
               onClick={(e) => {
                  changeUsername();
               }}
            >
               Change username
            </button>
            <button
               className='button button-blue'
               onClick={(e) => {
                  changeUploadkey();
               }}
            >
               Change uploadkey
            </button>
            <button
               className='button button-red'
               onClick={(e) => {
                  deleteUser(user.uploadkey);
               }}
            >
               Delete
            </button>
         </DashboardButtons>
      </DashboardItemWrapper>
   );
}

export default Users;
