import { getConnection, getConnection2, sql } from '../../database/conecction';
const axios = require('axios');
// const fetch = require('node-fetch');

// import fetch from 'node-fetch';

export class PideService {
  static _pideServiceInstance = null;
  constructor() { }

  url_base = `https://ws5.pide.gob.pe/Rest/APide/Sunarp`;
  // url_base = `https://ws5.pide.gob.pe/Rest/APide/Sunarp/WSServicePJRazonSocial?out=json`;

  user = '20131368152-MUNICHORRILLOS';
  clave = 'L3wUaCnuSs@IOxf';

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


  ///////////////////////////
  ///////////////////////////
  ///////////////////////////
  ///////////////////////////

  // CONSULTA PIDE
  ServicegetOficinas = async () => {
    try {
      let url = "https://ws5.pide.gob.pe/Rest/APide/Sunarp/WSServicegetOficinas?usuario=20131368152-MUNICHORRILLOS&clave=L3wUaCnuSs@IOxf&out=json";
      console.info(url);
      const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.        
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.json(); // parses JSON response into native JavaScript objects
    } catch (error) {
      console.info(error);
      return error.message;
    }
  };

  // CONSULTA PIDE
  ServicePJRazonSocial = async (razon_social) => {
    try {
      let url = "https://ws5.pide.gob.pe/Rest/APide/Sunarp/WSServicePJRazonSocial?out=json";
      console.info(url);
      const data = {
        "PIDE": {
          "usuario": "20131368152-MUNICHORRILLOS",
          "clave": "L3wUaCnuSs@IOxf",
          "razonSocial": razon_social.trim()
        }
      };

      const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.        
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      });
      return response.json(); // parses JSON response into native JavaScript objects


    } catch (error) {
      console.info(error);
      return error.message;
    }
  };

  // CONSULTA PIDE
  ServiceTitularidadSIRSARP = async (type_participant, names, father_lastname, mother_lastname, business_name) => {
    try {
      let url = "https://ws5.pide.gob.pe/Rest/APide/Sunarp/WSServiceTitularidadSIRSARP?out=json";
      console.info(url);
      var data;
      if (type_participant == "N") {
        data = {
          "PIDE": {
            "usuario": "20131368152-MUNICHORRILLOS",
            "clave": "L3wUaCnuSs@IOxf",
            "tipoParticipante": type_participant.toUpperCase(),
            "nombres": names.toUpperCase(),
            "apellidoPaterno": father_lastname.toUpperCase(),
            "apellidoMaterno": mother_lastname.toUpperCase(),
          }
        };
      }

      if (type_participant == "J") {
        data = {
          "PIDE": {
            "usuario": "20131368152-MUNICHORRILLOS",
            "clave": "L3wUaCnuSs@IOxf",
            "tipoParticipante": type_participant,
            "razonSocial": business_name.toUpperCase(),

          }
        };
      }

      const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.        
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      });
      return response.json(); // parses JSON response into native JavaScript objects
    } catch (error) {
      console.info(error);
      return error.message;
    }
  };

  // LISTAR ASIENTOS
  ServicelistarAsientosSIRSARP = async (codZona, codOficina, numeroPartida, registro = '') => {
    try {
      let url = "https://ws5.pide.gob.pe/Rest/APide/Sunarp/WSServicelistarAsientosSIRSARP?out=json";

      console.info(url);
      var _registro = 0;

      switch (registro) {
        case "REGISTRO DE PROPIEDAD INMUEBLE":
          _registro = 21000;
          break;
        case "REGISTRO DE BIENES MUEBLES":
          _registro = 24000;
          break;
        case "REGISTRO DE PERSONAS JURIDICAS":
          _registro = 22000;
          break;
        case "REGISTRO DE PERSONAS NATURALES":
          _registro = 23000;
          break;
        default:
          break;
      }
      const data = {
        "PIDE": {
          "usuario": "20131368152-MUNICHORRILLOS",
          "clave": "L3wUaCnuSs@IOxf",
          "zona": codZona,
          "oficina": codOficina,
          "partida": numeroPartida,
          "registro": _registro
        }
      };

      const response = await fetch(url, {
        method: 'POST', //   
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data) // 
      });

      if (!response.ok) {
        const text = await response.text();
        throw Error(text);
      }     
       
      const jsonResponse = await response.json();
      return jsonResponse; //     

    } catch (error) {
      console.info(error);
      return error.message;
    }
  };

  // VER ASIENTOS
  ServiceverAsientosSIRSARP = async (transaccion, idImg, tipo, nroTotalPag, nroPagRef, pagina) => {
    try {
      let url = "https://ws5.pide.gob.pe/Rest/APide/Sunarp/WSServiceverAsientosSIRSARP?out=json";
      console.info(url);
      const data = {
        "PIDE": {
          "usuario": "20131368152-MUNICHORRILLOS",
          "clave": "L3wUaCnuSs@IOxf",
          "transaccion": transaccion,
          "idImg": idImg,
          "tipo": tipo,
          "nroTotalPag": nroTotalPag,
          "nroPagRef": nroPagRef,
          "pagina": pagina
        }
      };
      const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.        
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      });
      return response.json(); // parses JSON response into native JavaScript objects

    } catch (error) {
      console.info(error);
      return error.message;
    }
  };
  
  // LISTAR DETALLE RPVE  EXTRA
  ServiceverDetalleRPVExtra = async (codZona, codOficina, placa) => {
    try {
      let url = "https://ws5.pide.gob.pe/Rest/APide/Sunarp/WSServiceverDetalleRPVExtra?out=json";
      console.info(url);
      
      const data = {
        "PIDE": {
          "usuario": "20131368152-MUNICHORRILLOS",
          "clave": "L3wUaCnuSs@IOxf",
          "zona": codZona,
          "oficina": codOficina,
          "placa": placa,
        }
      };
      const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.        
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      });
      return response.json(); // parses JSON response into native JavaScript objects

    } catch (error) {
      console.info(error);
      return error.message;
    }
  };

  //  REGISTRO DE LOG  DE CONSULTAS
  recordQuery = async (data) => {
    try {
      console.info("recordQuery_recordQuery_:::::", data);

      const pool = await getConnection();
      const result = await pool.request()
        .input("USER_ID", sql.Int, data.user_id)
        .input("SERVICE_ID", sql.Int, data.service_id)
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
            @CREATED_DATE )`);
      // pool.close();

      return result.recordsets[0];
    } catch (error) {
      console.info(error);
      return error.message;
    }
  };

}
