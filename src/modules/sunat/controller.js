import { PideService } from "./services";
const pideService = PideService.getInstance();
import { success, error } from "../../helpers/response";

const postQuerySunat= async (req, res) => {
  try {
    var _service_id = 2;    
    const _datetime = new Date();
    //
    var { user_key,document_number,s_key,mac=null,longitude = null,latitude = null,environment = null } = req.body;
    // VALIDAR SI EL SOLICITANTE EXISTE     
    var Authorized = await pideService.validatePermissions(user_key);
    if (Authorized.length == 0) {
      return res.status(400).send(error(["El usuario no está autorizado para realizar este tipo de consultas."], 400));
    }    
    // VALIDAR SI EL SOLICITANTE TIENE PERMISOS  
    if (Authorized[0].STATUS == 0) {
      return res.status(400).send(error(["Tu cuenta está inactiva, comunicate con el administrador del sistema."], 400));
    }
    // VALIDAR EXISTENCIA DEL SISTEMA
    var result_system = await pideService.getSystemByKey(s_key);
    if (result_system.length == 0) {
      return res.status(400).send(error(["El sistema no esta autorizado o su llave es incorrecta."], 400));
    }
    // GENERAR SOLICITUD
    var result_query = await pideService.querySunatByRuc(document_number);    
    if(result_query == null){
      return res.status(200).send(success(["No existe información del número ingresado"],null, 200));
    }    
    // RESULT QUERY JSON A STRING    
    let _result_query = JSON.stringify(result_query);    
    // CONTRUIR OBJETO LOG_CONGULTA
    let _data_log = {
      "service_id": _service_id,
      "user_id": Authorized[0].USER_ID,
      "search_parameter": `RUC: ${document_number}`,
      "system_id": result_system[0].SYSTEM_ID,
      "s_key" :s_key,
      "mac": mac,
      "ip_adress": req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      "longitude": longitude,
      "latitude": latitude,
      "environment": environment,
      "device": req.headers['user-agent'],
      "result": _result_query,
      "datetime": _datetime,
      "created_by": `${Authorized[0].NAMES} ${Authorized[0].FATHER_LASTNAME}`
    }
    // GUARDAR LOG_CONSULTA
    var result = await pideService.recordQuery(_data_log);
    // RESPONSE CLIENT
    return res.status(200).send(success(["Success"], result_query, 200));
  } catch (err) {
    console.log(err);
    if (err.code === 'ETIMEDOUT') {
      res.status(408).send(error(["Tiempo de consulta excedido"], 408));
    }
    // return res.status(400).send(err);
    return res.status(400).send(error(["error"], 400));
  }
};

export default {
  postQuerySunat, 
};