import axiosClient from 'api/axiosClient';
import capitalizeFirstLetter from 'api/utils/capitalizeFirstLetter';
import { useErrorWidgitUpdate } from 'components/Context/ErrorWidgitContext';
import { useSuccessWidgitUpdate } from 'components/Context/SuccessWidgitContext';
import { server } from 'config/api';
import { Settings as ISettings } from 'types/Dashboard';
import DashboardButtons from './DashboardButtons';
import DashboardItemWrapper from './DashboardItemWrapper';
import DashboardName from './DashboardName';

interface SettingProps extends ISettings {
   setSettings: any;
}

function Settings({
   settings,
   setSettings,
}: {
   settings: ISettings[];
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
               />
            );
         })}
      </>
   );
}

function Setting(settings: SettingProps) {
   const updateSuccessWidgit = useSuccessWidgitUpdate();
   const updateErrorWidgit = useErrorWidgitUpdate();

   async function toggleSetting() {
      const confirm = window.confirm(
         'Are you sure you want to toggle the ' + settings.name + ' setting?',
      );

      if (confirm) {
         axiosClient
            .put(
               server +
                  '/api/dashboard/settings?action=toggle&name=' +
                  settings.name,
            )
            .catch((err) => updateErrorWidgit?.showErrorWidgit(err.message))
            .then((response) => {
               if (response?.status !== 200)
                  return updateErrorWidgit?.showErrorWidgit('An error occured');
               updateSuccessWidgit?.showSuccessWidgit(
                  capitalizeFirstLetter(settings.name) + ' setting toggled',
               );
               settings.setSettings(response.data);
            });
      } else {
         updateSuccessWidgit?.showSuccessWidgit('Setting not toggled');
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
         return updateSuccessWidgit?.showSuccessWidgit('Set setting cancelled');

      if (settings.type === 'string') {
         if (typeof newValue !== 'string')
            return updateErrorWidgit?.showErrorWidgit('Invalid type');
      } else if (settings.type === 'number') {
         const num = parseInt(newValue);
         if (isNaN(num) || !num)
            return updateErrorWidgit?.showErrorWidgit('Invalid type');

         newValue = num;
      }

      axiosClient
         .put(
            server + '/api/dashboard/settings?action=set&name=' + settings.name,
            {
               value: newValue,
            },
         )
         .catch((err) => updateErrorWidgit?.showErrorWidgit(err.message))
         .then((response) => {
            if (response?.status !== 200)
               return updateErrorWidgit?.showErrorWidgit('An error occured');
            updateSuccessWidgit?.showSuccessWidgit(
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
