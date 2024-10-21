import { getConnection, getConnection2, sql } from '../../database/conecction';
const axios = require('axios');

export class PideService {
  static _pideServiceInstance = null;
  constructor() { }

  url_base = `https://ws3.pide.gob.pe/Rest/Sunat`;

  static getInstance() {
    if (!PideService._pideServiceInstance) {
      PideService._pideServiceInstance = new PideService();
    }
    return PideService._pideServiceInstance;
  }

  // VALIDAR SI ESTA REGISTRADO EN LA PLATAFORMA DE CONSULTAS
  validatePermissions = async (user_key) => {
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
  querySunatByRuc = async (ruc) => {
    try {
      let url = `${this.url_base}/DatosPrincipales?numruc=${ruc}&out=json`;
      let res = await axios.get(url)
      var _res = res.data;
      var obj;
      var _result = _res.list.multiRef
      if (_result.ddp_nombre.$) {
        obj = {
          ruc: _result.ddp_numruc.$,
          name: _result.ddp_nombre.$.trim(),
          desc_ciiu: _result.desc_ciiu.$,
          desc_estado: _result.desc_estado.$,
          desc_flag22: _result.desc_flag22.$,
          desc_identi: _result.desc_identi.$,
          desc_tpoemp: _result.desc_tpoemp.$,
          ubigeo: _result.ddp_ubigeo.$,
          desc_dep: _result.desc_dep.$,
          desc_prov: _result.desc_prov.$,
          desc_dist: _result.desc_dist.$,
          desc_tipvia: _result.desc_tipvia.$,
          ddp_nomvia: _result.ddp_nomvia.$,
          ddp_numer1: _result.ddp_numer1.$,
          ddp_refer1: _result.ddp_refer1.$,
          desc_tpoemp: _result.desc_tpoemp.$,
        }
      } else {
        obj = null
      }
      // return _res;
      return obj;
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
