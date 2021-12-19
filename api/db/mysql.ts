import Connection from './connection';
import mysqlConfig from '../../config/mysql';

const connection = new Connection(
   mysqlConfig.username,
   mysqlConfig.password,
   mysqlConfig.database,
   mysqlConfig.host,
);
connection.connect();

import FileSQL from './fileSQL';
import ShortSQL from './shortSQL';

export const fileSQL = new FileSQL(connection.getConnection());
export const shortSQL = new ShortSQL(connection.getConnection());
