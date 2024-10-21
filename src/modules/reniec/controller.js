import { PideService } from "./services";
const pideService = PideService.getInstance();
import { success, error } from "../../helpers/response";

const postQueryReniec = async (req, res) => {
  try {
    var _entity = process.env.RUC_ENTITY;
    var _service_id = 1;
    const _datetime = new Date();
    var {
      user_key, document_number, s_key, mac=null,longitude = null,latitude = null, environment = null } = req.body;  
    // VALIDAR SI EL SOLICITANTE TIENE PERMISOS      
    var Authorized = await pideService.validatePermissions(user_key);
    console.info(Authorized);
    if (Authorized.length == 0) {
      return res.status(400).send(error(["El usuario no está autorizado para realizar este tipo de consultas."], 400));
    }
    // VALIDAR QUE EL SISTEMA EXISTA
    var result_system = await pideService.getSystemByKey(s_key);
    if (result_system.length == 0) {
      return res.status(400).send(error(["El sistema no esta autorizado o su llave es incorrecta."], 400));
    }
    // VALIDAR SI EL SOLICITANTE TIENE PERMISOS  
    if (Authorized[0].STATUS == 0) {
      return res.status(400).send(error(["Tu cuenta está inactiva, comunicate con el administrador del sistema."], 400));
    }
    // GENERAR CONSULTA DNI
    var result_query = await pideService.queryReniecByDni(
      Authorized[0].DOCUMENT_NUMBER, Authorized[0].PASS, _entity, document_number
    );
    // COVERTIMOS LA RESPUESTA A STRING CON --> "JSON.stringify"
    let _result_query = JSON.stringify(result_query);
    
    // REGISTRAR SOLICITUD Y GUARDAR REPUESTA   
    let _data = {
      "service_id": _service_id,
      "user_id": Authorized[0].USER_ID,
      "search_parameter": `DNI: ${document_number}`,
      "s_key": s_key,
      "system_id": result_system[0].SYSTEM_ID,
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
    var result = await pideService.recordQuery(_data);

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
  postQueryReniec
};