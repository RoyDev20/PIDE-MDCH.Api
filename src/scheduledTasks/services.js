import { getConnection, getConnection2, sql } from '../database/conecction';
const axios = require('axios');
export class SchedulerService {
  static _schedulerServiceInstance = null;
  url_base = `https://ws5.pide.gob.pe/Rest/Reniec`;
  constructor() { }
  static getInstance() {
    if (!SchedulerService._schedulerServiceInstance) {
      SchedulerService._schedulerServiceInstance = new SchedulerService();
    }
    return SchedulerService._schedulerServiceInstance;
  }

  // VALIDAR SI ESTA REGISTRADO EN LA PLATAFORMA DE CONSULTAS
  getUsersReniec = async () => {
    try {
      const pool = await getConnection();
      var result = await pool.request().query(`SELECT * FROM TB_USERS WHERE ACTIVE_USER = 1;`);
      pool.close();
      return result.recordset;
    } catch (error) {
      console.info(error);
      return error.message;
    }
  };

  // CAMBIAR CONTRASEÑA
  changePasswordRENIEC = async (nuDni, nuRuc, credencialAnterior, credencialNueva) => {
    try {
      let url = `${this.url_base}/ActualizarCredencial?credencialAnterior=${credencialAnterior}&credencialNueva=${credencialNueva}&nuDni=${nuDni}&nuRuc=${nuRuc}&out=json`;
      let res = await axios.get(url)
      // console.log(res.data);
      var _res = res.data;
      return _res;
    } catch (error) {
      console.info(error);
      return error.message;
    }
  };

  // ACTUALIZAR  CONTRASEÑA EN LA BASE DE DATOS
  updatePasswordDb = async (PASS, USER_ID) => {
    try {
      const pool = await getConnection();
      var result = await pool.
        request()
        .input("USER_ID", sql.Int, USER_ID)
        .input("PASS", sql.VarChar, PASS)
        .input("MODIFIED_BY", sql.VarChar, "TASK SYSTEM")
        .input("MODIFIED_DATE", sql.DateTime, new Date())
        .query(`
          UPDATE TB_USERS
          SET PASS = @PASS, MODIFIED_BY = @MODIFIED_BY, MODIFIED_DATE = @MODIFIED_DATE
          WHERE USER_ID = @USER_ID;
        `);
      pool.close();
      return result.recordset;
    } catch (error) {
      console.info(error);
      return error.message;
    }
  };

}
