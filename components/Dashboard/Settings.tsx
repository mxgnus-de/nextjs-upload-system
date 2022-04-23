import { Setting as ISetting } from '@prisma/client';
import axiosClient from 'api/axiosClient';
import capitalizeFirstLetter from 'utils/capitalizeFirstLetter';
import { useErrorWidgetUpdate } from 'components/Context/ErrorWidgetContext';
import { useSuccessWidgetUpdate } from 'components/Context/SuccessWidgetContext';
import DashboardButtons from './DashboardButtons';
import DashboardItemWrapper from './DashboardItemWrapper';
import DashboardName from './DashboardName';

interface SettingProps extends ISetting {
   setSettings: any;
}

function Settings({
   settings,
   setSettings,
}: {
   settings: ISetting[];
   setSettings: any;
}) {
   return (
      <>
         {settings.map((setting, index) => {
            return (
               <Setting
                  key={index}
                  name={setting.name}
                  value={setting.value}
                  setSettings={setSettings}
                  type={setting.type}
                  info={setting.info}
               />
            );
         })}
      </>
   );
}

function Setting(settings: SettingProps) {
   const updateSuccessWidget = useSuccessWidgetUpdate();
   const updateErrorWidget = useErrorWidgetUpdate();

   async function toggleSetting() {
      const confirm = window.confirm(
         'Are you sure you want to toggle the ' + settings.name + ' setting?',
      );

      if (confirm) {
         axiosClient
            .put(
               process.env.NEXT_PUBLIC_URL +
                  '/api/dashboard/settings?action=toggle&name=' +
                  settings.name,
            )
            .catch((err) => {
               updateErrorWidget?.showErrorWidget('An error occured');
            })
            .then((response) => {
               if (response?.status !== 200)
                  return updateErrorWidget?.showErrorWidget(
                     'An error occured!',
                  );
               updateSuccessWidget?.showSuccessWidget(
                  capitalizeFirstLetter(settings.name) + ' setting toggled',
               );
               settings.setSettings(response.data);
            });
      } else {
         updateSuccessWidget?.showSuccessWidget('Setting not toggled');
      }
   }

   async function setSetting() {
      let newValue: any = window.prompt(
         'Enter new value for ' +
            settings.name +
            ' setting.\n\nType: ' +
            settings.type,
      );
      if (!newValue)
         return updateSuccessWidget?.showSuccessWidget('Set setting cancelled');

      if (settings.type === 'string') {
         if (typeof newValue !== 'string')
            return updateErrorWidget?.showErrorWidget('Invalid type');
      } else if (settings.type === 'number') {
         const num = parseInt(newValue);
         if (isNaN(num) || !num)
            return updateErrorWidget?.showErrorWidget('Invalid type');

         newValue = num;
      }

      axiosClient
         .put(
            process.env.NEXT_PUBLIC_URL +
               '/api/dashboard/settings?action=set&name=' +
               settings.name,
            {
               value: newValue,
            },
         )
         .catch((err) => updateErrorWidget?.showErrorWidget(err.message))
         .then((response) => {
            if (response?.status !== 200)
               return updateErrorWidget?.showErrorWidget('An error occured');
            updateSuccessWidget?.showSuccessWidget(
               capitalizeFirstLetter(settings.name) + ' setting set',
            );
            settings.setSettings(response.data);
         });
   }

   return (
      <DashboardItemWrapper>
         <DashboardName>{capitalizeFirstLetter(settings.name)}</DashboardName>
         <div>
            {settings.type === 'boolean'
               ? settings.value === 'true'
                  ? 'Enabled'
                  : 'Disabled'
               : settings.value}
         </div>
         <DashboardButtons>
            <button
               className='button button-blue'
               onClick={(e) => {
                  if (settings.type === 'boolean') toggleSetting();
                  else setSetting();
               }}
            >
               {settings.type === 'boolean' ? 'Toggle' : 'Change'}
            </button>
         </DashboardButtons>
      </DashboardItemWrapper>
   );
}

export default Settings;
