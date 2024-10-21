import sql from 'mssql';
import config from "../config";
const conecctionSql = config.conecctionSql;
const conecctionSql2 = config.conecctionSql2;

const  dbSettings = {
  ...conecctionSql,  
  pool: {
    max: 15,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false,
    trustServerCertificate : true
  }
}
const  dbSettings2 = {
  ...conecctionSql2,  
  pool: {
    max: 15,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false,
    trustServerCertificate : true
  }
}

export async function getConnection() {
  try {
    // console.info("dbSettings::::::", dbSettings);
    const pool1 = new sql.ConnectionPool(dbSettings)

    // console.info("pool1::::: ",pool1);
    await pool1.connect();
    return pool1;
  } catch (error) {
    console.error(error);
  }
}
export async function getConnection2() {
  try {
    // console.info("dbSettings::::::", dbSettings);
    const pool2 = new sql.ConnectionPool(dbSettings2)
    // console.info("pool2::::: ",pool2);
    await pool2.connect();
    return pool2;
  } catch (error) {
    console.error(error);
  }
}

export { sql };

