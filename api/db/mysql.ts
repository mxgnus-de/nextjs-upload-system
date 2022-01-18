import Connection from './connection';
import mysqlConfig from '../../config/mysql';

const connection = new Connection(
   mysqlConfig.username,
   mysqlConfig.password,
   mysqlConfig.database,
   mysqlConfig.host,
);
connection.connect();
connection.utils();

import FileSQL from './fileSQL';
import ShortSQL from './shortSQL';
import UserSQL from './userSQL';
import SettingsSQL from './settingsSQL';

export const fileSQL = new FileSQL(connection.getConnection());
export const shortSQL = new ShortSQL(connection.getConnection());
export const userSQL = new UserSQL(connection.getConnection());
export const settingsSQL = new SettingsSQL(connection.getConnection());
export { connection };
