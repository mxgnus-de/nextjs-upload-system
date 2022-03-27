import axiosClient from 'api/axiosClient';
import { AxiosError } from 'axios';
import { User as IUser, User } from '@prisma/client';
import { useErrorWidgetUpdate } from 'components/Context/ErrorWidgetContext';
import { useSuccessWidgetUpdate } from 'components/Context/SuccessWidgetContext';
import { server } from 'config/api';
import { useCookies } from 'react-cookie';
import DashboardButtons from './DashboardButtons';
import DashboardName from './DashboardName';
import DashboardItemWrapper from './DashboardItemWrapper';
import styled from 'styled-components';
import {
   ChangeEvent,
   Dispatch,
   SetStateAction,
   useEffect,
   useState,
} from 'react';
import { useBackgroundUpdate } from 'components/Context/BackgroundContext';
import capitalizeFirstLetter from 'utils/capitalizeFirstLetter';
import { permissionsMap } from 'utils/permissions';
import CloseIconSvg from '@mui/icons-material/Close';

function Users({ users, setUsers }: { users: IUser[]; setUsers: any }) {
   const updateSuccessWidget = useSuccessWidgetUpdate();
   const updateErrorWidget = useErrorWidgetUpdate();
   const updateBackground = useBackgroundUpdate();
   const [permsManagerState, setPermsManagerState] = useState<{
      state: boolean;
      user: IUser;
      permissions: {
         [key: string]: boolean;
      };
   } | null>(null);

   useEffect(() => {
      if (permsManagerState?.state) {
         const { permissions } = permsManagerState;

         if (!Object.keys(permissions).length) {
            const newPermissions: {
               [key: string]: boolean;
            } = {};
            getAllPermissions().forEach(({ name, value }) => {
               newPermissions[name] = value;
            });

            setPermsManagerState({
               ...permsManagerState,
               permissions: newPermissions,
            });
         }
         updateBackground.setBackground({
            show: true,
         });
      } else {
         updateBackground.setBackground({
            show: false,
         });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [permsManagerState?.state, permsManagerState?.user]);

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
               updateSuccessWidget?.showSuccessWidget(
                  'User created with username ' + username,
               );
            })
            .catch((err: AxiosError) => {
               updateErrorWidget?.showErrorWidget(
                  err.message + ': ' + err.response?.statusText,
               );
            });
      } else {
         return updateSuccessWidget?.showSuccessWidget(
            'User creation cancelled',
         );
      }
   }

   function permissionChange(e: ChangeEvent<HTMLInputElement>, name: string) {
      const isChecked = e.target.checked;
      setPermsManagerState((prev) => {
         if (!prev) return null;
         const { user, permissions } = prev;
         if (!permissions) return prev;
         const newPermissions = { ...permissions };
         newPermissions[name] = isChecked;
         return {
            ...prev,
            permissions: newPermissions,
         };
      });
   }

   async function savePermissions() {
      const state = permsManagerState;
      if (!state) return;
      const { user, permissions } = state;
      if (!user || !permissions) return;
      const { username } = user;
      const newPermissions: {
         [key: string]: boolean;
      } = {};
      Object.keys(permissions).forEach((key) => {
         if (permissions[key]) newPermissions[key] = true;
      });
      const newPermissionsString = Object.keys(newPermissions).join(',');

      await axiosClient
         .put(
            `${server}/api/dashboard/users?key=${user.key}&action=changepermissions`,
            {
               username,
               permissions: newPermissionsString,
            },
         )
         .then((res) => {
            updateSuccessWidget?.showSuccessWidget(
               'Permissions saved for user ' + username,
            );
            setPermsManagerState(null);
            if (res.data?.users) {
               setUsers(res.data.users);
            }
         })
         .catch((err: AxiosError) => {
            updateErrorWidget?.showErrorWidget(
               err.message + ': ' + err.response?.statusText,
            );
         });
   }

   function getAllPermissions() {
      const user = permsManagerState?.user;
      if (!user) return [];
      const perms = permissionsMap(user.permissions);
      const permsArray = Object.keys(perms).map((key) => {
         return {
            name: key,
            value: perms[key],
         };
      });
      return permsArray;
   }

   return (
      <>
         {users?.length ? (
            users.map((user, index) => {
               return (
                  <User
                     key={index}
                     user={{ ...user, setUsers, setPermsManagerState }}
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
            Create user
         </button>
         {permsManagerState?.state ? (
            <>
               <PermsWrapper show={permsManagerState?.state}>
                  <PermsContainer show={permsManagerState?.state}>
                     <PermsTitle>
                        {capitalizeFirstLetter(permsManagerState.user.username)}
                        &apos;s permissions
                        <PermsCloseIconWrapper>
                           <CloseIcon
                              onClick={() => setPermsManagerState(null)}
                           />
                        </PermsCloseIconWrapper>
                     </PermsTitle>
                     <PermsListWrapper>
                        {Object.keys(permsManagerState.permissions).map(
                           (name, index) => {
                              const value = permsManagerState.permissions[name];

                              return (
                                 <PermsListItem key={index}>
                                    <PermsListCheckbox
                                       checked={
                                          permsManagerState.permissions[
                                             'admin'
                                          ] || value
                                       }
                                       type='checkbox'
                                       onChange={(e) => {
                                          permissionChange(e, name);
                                       }}
                                    />
                                    <PermsListCheckboxLabel>
                                       {capitalizeFirstLetter(
                                          name.replaceAll('_', ' '),
                                       )}
                                    </PermsListCheckboxLabel>
                                 </PermsListItem>
                              );
                           },
                        )}
                     </PermsListWrapper>
                     <PermsSubmitButtonWrapper>
                        <span
                           className='button button-green'
                           onClick={() => savePermissions()}
                        >
                           Submit
                        </span>
                     </PermsSubmitButtonWrapper>
                  </PermsContainer>
               </PermsWrapper>
            </>
         ) : null}
      </>
   );
}

interface UserProps extends User {
   setUsers: any;
   setPermsManagerState: Dispatch<
      SetStateAction<{
         state: boolean;
         user: IUser;
         permissions: {
            [key: string]: boolean;
         };
      } | null>
   >;
}

function User({ user }: { user: UserProps }) {
   const updateSuccessWidget = useSuccessWidgetUpdate();
   const updateErrorWidget = useErrorWidgetUpdate();
   const [cookies, setCookies, removeCookies] = useCookies(['upload_key']);

   function deleteUser(uploadkey: string) {
      const confirm = window.confirm(
         `Are you sure you want to delete ${user.username}?`,
      );

      if (confirm) {
         axiosClient
            .delete(`/api/dashboard/users?key=${uploadkey}`)
            .then(async () => {
               updateSuccessWidget?.showSuccessWidget(
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
               updateErrorWidget?.showErrorWidget(
                  error.message + ': ' + error.response?.statusText,
               );
            });
      } else {
         return updateSuccessWidget?.showSuccessWidget('Cancelled');
      }
   }

   async function setCustomPassword() {
      const password = window.prompt('Password:');
      if (password) {
         let err = false;
         const response = await axiosClient
            .put(
               `${server}/api/dashboard/users?key=${user.key}&action=setpassword`,
               {
                  password,
               },
            )
            .catch((error) => {
               console.log(error);
               err = true;
               updateErrorWidget?.showErrorWidget(
                  'Error setting password: ' + error.response?.data?.message ||
                     error.response?.statusText,
               );
            });

         if (err) return;

         if (user.key === cookies.upload_key) {
            setCookies('upload_key', password, { path: '/' });
         }
      } else {
         return updateSuccessWidget?.showSuccessWidget(
            'Password creation cancelled',
         );
      }
   }

   function copieUploadkey() {
      if (navigator.clipboard) {
         navigator.clipboard.writeText(user.key);
         updateSuccessWidget?.showSuccessWidget('Upload key copied');
      }
   }

   function changeUploadkey() {
      const confirm = window.confirm(
         `Are you sure you want to change ${user.username}'s upload key?`,
      );

      if (confirm) {
         axiosClient
            .put(`/api/dashboard/users?key=${user.key}&action=changekey`)
            .then((res) => {
               updateSuccessWidget?.showSuccessWidget(
                  `${user.username}'s upload key changed`,
               );
               if (navigator.clipboard) {
                  navigator.clipboard.writeText(res.data.newuploadkey);
                  updateSuccessWidget?.showSuccessWidget('Upload key copied');
               }
               alert('New upload key:\n' + res.data.newuploadkey);
               if (cookies['upload_key'] === user.key) {
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
               updateErrorWidget?.showErrorWidget(
                  error.message + ': ' + error.response?.statusText,
               );
            });
      } else {
         return updateSuccessWidget?.showSuccessWidget('Cancelled');
      }
   }

   function changeUsername() {
      const newUsername = window.prompt('New username:');
      if (newUsername) {
         axiosClient
            .put(
               server +
                  '/api/dashboard/users?action=changeusername&key=' +
                  user.key,
               {
                  newusername: newUsername,
               },
            )
            .catch((error: AxiosError) => {
               updateErrorWidget?.showErrorWidget(
                  error.message + ': ' + error.response?.statusText,
               );
            })
            .then((res: any) => {
               if (res?.data?.newusername) {
                  user.setUsers((prev: IUser[]) => {
                     const newusers: IUser[] = [];
                     prev.forEach((item: IUser) => {
                        if (item.key !== user.key) {
                           newusers.push(item);
                        } else {
                           newusers.push({
                              ...item,
                              username: res.data.newusername,
                           });
                        }
                     });
                     return newusers;
                  });
                  updateSuccessWidget?.showSuccessWidget(
                     `${user.username}'s username changed to ${res.data.newusername}`,
                  );
               } else {
                  updateErrorWidget?.showErrorWidget(
                     'Could not change username',
                  );
               }
            });
      } else {
         return updateSuccessWidget?.showSuccessWidget('Cancelled');
      }
   }

   function editPerms() {
      user.setPermsManagerState(() => {
         return {
            permissions: {},
            state: true,
            user: user,
         };
      });
   }

   return (
      <DashboardItemWrapper>
         <DashboardName>
            {user.username}
            {cookies['upload_key'] === user.key && (
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
               className='button button-blue'
               onClick={(e) => {
                  setCustomPassword();
               }}
            >
               Edit password
            </button>
            <button className='button button-blue' onClick={() => editPerms()}>
               Edit perms
            </button>
            <button
               className='button button-red'
               onClick={(e) => {
                  deleteUser(user.key);
               }}
            >
               Delete
            </button>
         </DashboardButtons>
      </DashboardItemWrapper>
   );
}

interface PermsProps {
   show: boolean;
}

const PermsWrapper = styled.div<PermsProps>`
   position: absolute;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   z-index: 101;
   opacity: ${(props) => (props.show ? 1 : 0)};
   pointer-events: ${(props) => (props.show ? 'all' : 'none')};
   transition: opacity 0.3s ease-in-out, background-color 0.3s ease-in-out;
`;

const PermsContainer = styled.div<PermsProps>`
   width: clamp(300px, 600px, 100%);
   padding: 20px;
   background-color: ${(props) => (props.show ? '#131313' : 'transparent')};
   display: flex;
   flex-direction: column;
   border-radius: 5px;
   box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
   transition: background-color 0.3s ease-in-out;
   gap: 2em;
`;

const PermsCloseIconWrapper = styled.div`
   position: absolute;
   top: 0;
   right: 0;
   cursor: pointer;
   display: flex;
   align-items: center;
   justify-content: center;
`;

const CloseIcon = styled(CloseIconSvg)`
   width: 25px;
   height: 25px;
   fill: #adadad;
`;

const PermsTitle = styled.span`
   position: relative;
   font-size: 1.5em;
   font-weight: bold;
   margin-bottom: 20px;
   text-align: center;
`;

const PermsListWrapper = styled.div`
   display: grid;
   grid-template-columns: 1fr 1fr;
   gap: 1em;
   width: 100%;
   height: 100%;
`;

const PermsListItem = styled.div`
   display: flex;
   align-items: center;
   width: 100%;
   height: 100%;
   padding: 10px;
`;

const PermsListCheckbox = styled.input`
   margin-right: 10px;
   width: 20px;
   height: 20px;
`;

const PermsListCheckboxLabel = styled.label`
   font-size: 1em;
   font-weight: bold;
   color: #fff;
`;

const PermsSubmitButtonWrapper = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
`;

export default Users;
