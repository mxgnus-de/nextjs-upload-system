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
   return (
      <DashboardItemWrapper>
         <DashboardName>{capitalizeFirstLetter(settings.name)}</DashboardName>
         <div>{settings.value === 'true' ? 'Enabled' : 'Disabled'}</div>
         <DashboardButtons>
            <button
               className='button button-blue'
               onClick={(e) => {
                  toggleSetting();
               }}
            >
               Toggle
            </button>
         </DashboardButtons>
      </DashboardItemWrapper>
   );
}

export default Settings;
