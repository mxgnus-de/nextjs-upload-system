import axiosClient from 'api/axiosClient';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Settings } from 'types/Dashboard';
import Notification from 'types/Notification';

function DashboardNotifications() {
   const [cookies, setCookies, removeCookies] = useCookies();

   useEffect(() => {
      axiosClient
         .get('/api/dashboard/settings', {
            withCredentials: true,
         })
         .catch(() => {})
         .then((settingsresponse) => {
            console.log(settingsresponse);
            if (!settingsresponse?.data) return;
            const settings = settingsresponse.data;
            if (
               settings.find(
                  (setting: Settings) => setting.name === 'notifications',
               )?.value === 'true'
            ) {
               axiosClient
                  .get('/api/dashboard/notifications', {
                     withCredentials: true,
                  })
                  .catch(() => {})
                  .then((notificationsresponse) => {
                     console.log(notificationsresponse);
                     if (!notificationsresponse?.data?.notifications) return;
                     const notifications =
                        notificationsresponse.data.notifications;

                     notifications.forEach((notification: Notification) => {
                        if (
                           cookies['notification_' + notification.name] ===
                           undefined
                        ) {
                           if (notification.show) {
                              const confirm = window.confirm(
                                 notification.message,
                              );
                              if (confirm) {
                                 setCookies(
                                    'notification_' + notification.name,
                                    'true',
                                    {
                                       path: '/dashboard',
                                    },
                                 );
                                 if (notification.url) {
                                    window.open(notification.url);
                                 }
                              }
                           }
                        }
                     });
                  });
            }
         });
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
   return null;
}

export default DashboardNotifications;
