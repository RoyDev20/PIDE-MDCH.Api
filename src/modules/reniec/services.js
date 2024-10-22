import { getConnection, getConnection2, sql } from '../../database/conecction';
const axios = require('axios');

export class PideService {
  static _pideServiceInstance = null;
  // url_base = `https://ws5.pide.gob.pe/Rest/Reniec`;
  url_base = `https://ws2.pide.gob.pe/Rest/RENIEC`;
  constructor() { }
  static getInstance() {
    if (!PideService._pideServiceInstance) {
      PideService._pideServiceInstance = new PideService();
    }
    return PideService._pideServiceInstance;
  }
  
  // VALIDAR SI ESTA REGISTRADO EN LA PLATAFORMA DE CONSULTAS
  validatePermissions = async (user_key) => {
    console.info("user_key",user_key);
    try {
      const pool = await getConnection();
      var result = await pool.
        request()
        .input("USER_KEY", sql.VarChar, user_key)
        .query(`SELECT * FROM TB_USERS WHERE USER_KEY = @USER_KEY`);
      pool.close();
      return result.recordsets[0];
    } catch (error) {
      console.info(error);
      return error.message;
    }
  };

  // CONSULTA PIDE
  queryReniecByDni = async (user, password, entity, dniConsulta) => {
    try {
      let url = `${this.url_base}/Consultar?nuDniConsulta=${dniConsulta}&nuDniUsuario=${user}&password=${password}&nuRucUsuario=${entity}&out=json`;
      let res = await axios.get(url)
      console.log(res.data);
      var _res = res.data;
      // if (_res.consultarResponse?.return?.datosPersona?.foto) {
      //   delete _res.consultarResponse.return.datosPersona.foto;
      // }
      return _res.consultarResponse.return;
    } catch (error) {
      console.info(error);
      return error.message;
    }
  };

  //  BUSCAR SISTEMA POR KEY
  getSystemByKey = async (s_key) => {
    try {
      // BUSCA EL SISTEMA POR S_KEY
      const pool2 = await getConnection2();
      const result = await pool2.request()
      .input("S_KEY", sql.VarChar, s_key)
      .query(`SELECT * FROM TB_SYSTEMS WHERE S_KEY = @S_KEY;`);
      pool2.close();
      return result.recordset;
    } catch (error) {
      console.info(error);
      return error.message;
    }
  };

  //  REGISTRO DE LOG  DE CONSULTAS
  recordQuery = async (data) => {
    try {           
      const pool = await getConnection();
      const result = await pool.request()
        .input("SERVICE_ID", sql.Int, data.service_id)
        .input("USER_ID", sql.VarChar, data.user_id)
        .input("SEARCH_PARAMETER", sql.VarChar, data.search_parameter)
        .input("S_KEY", sql.VarChar, data.s_key)
        .input("SYSTEM_ID", sql.Int, data.system_id)
        .input("MAC", sql.VarChar, data.mac)
        .input("IP_ADRESS", sql.VarChar, data.ip_adress)
        .input("LONGITUDE", sql.VarChar, data.longitude)
        .input("LATITUDE", sql.VarChar, data.latitude)
        .input("ENVIRONMENT", sql.VarChar, data.environment)
        .input("DEVICE", sql.VarChar, data.device)
        .input("RESULT", sql.VarChar, data.result)
        .input("STATUS", sql.Int, 1)
        .input("CREATED_BY", sql.VarChar, data.created_by)
        .input("CREATED_DATE", sql.DateTime, data.datetime)
        .query(`
        INSERT INTO TB_QUERY_LOG ( 
          USER_ID, 
          SERVICE_ID, 
          SEARCH_PARAMETER, 
          S_KEY, 
          SYSTEM_ID, 
          MAC, 
          IP_ADRESS,
          LONGITUDE, 
          LATITUDE,
          ENVIRONMENT,
          DEVICE,
          RESULT, 
          STATUS, 
          CREATED_BY, 
          CREATED_DATE)
          VALUES ( 
            @USER_ID, 
            @SERVICE_ID, 
            @SEARCH_PARAMETER, 
            @S_KEY, 
            @SYSTEM_ID, 
            @MAC, 
            @IP_ADRESS,
            @LONGITUDE, 
            @LATITUDE,
            @ENVIRONMENT,
            @DEVICE,
            @RESULT, 
            @STATUS, 
            @CREATED_BY, 
            @CREATED_DATE );
        `);
        pool.close();
      return result.recordsets[0];
    } catch (error) {
      console.info(error);
      return error.message;
    }
  };

}
