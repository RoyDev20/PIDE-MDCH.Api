import { PideService } from "./services";
const pideService = PideService.getInstance();
import { success, error } from "../../helpers/response";

const getOficinas = async (req, res) => {
  try {    
    //LISTAR OFICINAS
    var result_office = await pideService.ServicegetOficinas();
    let _result_office = result_office.oficina.oficina
    console.info("_result_office:::::::", _result_office);
    // RESPONSE CLIENT
    return res.status(200).send(success(["Success"], _result_office, 200));
    // return res.status(200).send(success(["Success"], result_query, 200));
  } catch (err) {
    console.log(err);
    if (err.code === 'ETIMEDOUT') {
      res.status(408).send(error(["Tiempo de consulta excedido"], 408));
    }
    // return res.status(400).send(err);
    return res.status(400).send(error(["error"], 400));
  }
};

const postDetalleRPVExtra = async (req, res) => {
  try {
    var _service_id = 3; // TitularidadSIRSARP
    const _datetime = new Date();
    //
    var {
      oficina,
      placa,
      user_key,
      s_key,
      mac=null,
      longitude = null,
      latitude = null,
      environment = null,
    } = req.body;
    // VALIDAR SI EL SOLICITANTE ESTA REGISTRADO      
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

    //LISTAR OFICINAS
    var result_office = await pideService.ServicegetOficinas();
    let _result_office = result_office.oficina.oficina
    console.info("_result_office:::::::", _result_office);

    var of = _result_office.find(x => x.descripcion.trim() === oficina.trim());
    let _codZona = of.codZona;
    let _codOficina = of.codOficina;

    const result_detalle = await pideService.ServiceverDetalleRPVExtra(_codZona, _codOficina, placa);
    console.info("result_detalle:::::::", result_detalle);

    // RESULT QUERY JSON A STRING    
    let _result_query = JSON.stringify(result_detalle);

    // FORMAT PARAMETER
    let _search_parameter = `Zona: ${_codZona}, Oficina: ${_codOficina}, Placa: ${placa}`;

    // CONTRUIR OBJETO LOG_CONGULTA
    let _data_log = {
      "service_id": _service_id,
      "user_id": Authorized[0].USER_ID,
      "search_parameter": _search_parameter,
      "system_id": result_system[0].SYSTEM_ID,
      "s_key": s_key,
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
    return res.status(200).send(success(["Success"], result_detalle, 200));
    // return res.status(200).send(success(["Success"], result_query, 200));
  } catch (err) {
    console.log(err);
    if (err.code === 'ETIMEDOUT') {
      res.status(408).send(error(["Tiempo de consulta excedido"], 408));
    }
    // return res.status(400).send(err);
    return res.status(400).send(error(["error"], 400));
  }
};

const postQueryPJRazonSocial = async (req, res) => {
  try {
    var _service_id = 5;
    const _datetime = new Date();
    //
    var {user_key,s_key,mac=null,longitude = null,latitude = null,environment = null,razon_social} = req.body;
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
    var result_query = await pideService.ServicePJRazonSocial(razon_social);
    if (result_query == null) {
      return res.status(200).send(success(["No existe información del número ingresado"], null, 200));
    }
    // RESULT QUERY JSON A STRING    
    let _result_query = JSON.stringify(result_query);
    // CONSTRUIR OBJETO LOG_CONGULTA
    let _data_log = {
      "service_id": _service_id,
      "user_id": Authorized[0].USER_ID,
      "search_parameter": razon_social,
      "system_id": result_system[0].SYSTEM_ID,
      "s_key": s_key,
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

const postTitularidadSIRSARP = async (req, res) => {
  try {
    var _service_id = 4; // TitularidadSIRSARP
    const _datetime = new Date();
    //
    var {
      type_participant,names = '',father_lastname = '',mother_lastname = '',business_name = '',
      user_key,s_key,mac=null,longitude = null,latitude = null,environment = null,
    } = req.body;
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
    
    // GENERAR SOLICITUD DE TITULARIDAD
    var result_titularidad = await pideService.ServiceTitularidadSIRSARP(type_participant, names, father_lastname, mother_lastname, business_name);
    if (result_titularidad.buscarTitularidadSIRSARPResponse.respuestaTitularidad == null) {
      return res.status(200).send(success(["No existe información"], null, 200));
    }
    var _result_titularidad = result_titularidad.buscarTitularidadSIRSARPResponse.respuestaTitularidad.respuestaTitularidad;
    // RESULT QUERY JSON A STRING    
    let _result_query = JSON.stringify(_result_titularidad);
    // FORMAT PARAMETER
    var _search_parameter = '';
    if(type_participant == "N"){
      _search_parameter = `Tipo: ${type_participant}, Nombres: ${names}, Primer apellido: ${father_lastname}, Segundo apellido: ${mother_lastname}`;
    }
    if(type_participant == "J"){
      _search_parameter = `Tipo: ${type_participant}, Razón Social: ${business_name}`;
    }
    // CONTRUIR OBJETO LOG_CONGULTA
    let _data_log = {
      "service_id": _service_id,
      "user_id": Authorized[0].USER_ID,
      "search_parameter": _search_parameter,
      "system_id": result_system[0].SYSTEM_ID,
      "s_key": s_key,
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
    return res.status(200).send(success(["Success"], _result_titularidad, 200));
  } catch (err) {
    console.log(err);
    if (err.code === 'ETIMEDOUT') {
      res.status(408).send(error(["Tiempo de consulta excedido"], 408));
    }
    return res.status(400).send(error(["error"], 400));
  }
};

const postListarAsientosSIRSARP = async (req, res) => {
  try {
    var _service_id = 5; // TitularidadSIRSARP
    const _datetime = new Date();
    //
    var {
      oficina,
      numero_partida,
      registro,
      user_key,
      s_key,
      mac=null,
      longitude = null,
      latitude = null,
      environment = null,
    } = req.body;
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

    //LISTAR OFICINAS
    var result_office = await pideService.ServicegetOficinas();
    let _result_office = result_office.oficina.oficina
    console.info("_result_office:::::::", _result_office);

    var of = _result_office.find(x => x.descripcion.trim() === oficina.trim());
    let _codZona = of.codZona;
    let _codOficina = of.codOficina;

    const result_Asientos = await pideService.ServicelistarAsientosSIRSARP(_codZona, _codOficina, numero_partida, registro);
    let _result_Asientos = result_Asientos.listarAsientosSIRSARPResponse.asientos;
    console.info("_result_Asientos:::::::", _result_Asientos);

    // RESULT QUERY JSON A STRING    
    let _result_query = JSON.stringify(result_Asientos);

    // FORMAT PARAMETER
    let _search_parameter = `codZona: ${_codZona}, codOficina: ${_codOficina}, num_partida: ${numero_partida}, registro: ${registro}`;

    // CONTRUIR OBJETO LOG_CONGULTA
    let _data_log = {
      "service_id": _service_id,
      "user_id": Authorized[0].USER_ID,
      "search_parameter": _search_parameter,
      "system_id": result_system[0].SYSTEM_ID,
      "s_key": s_key,
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
    return res.status(200).send(success(["Success"], _result_Asientos, 200));
    // return res.status(200).send(success(["Success"], result_query, 200));
  } catch (err) {
    console.log(err);
    if (err.code === 'ETIMEDOUT') {
      res.status(408).send(error(["Tiempo de consulta excedido"], 408));
    }
    // return res.status(400).send(err);
    return res.status(400).send(error(["error"], 400));
  }
};

const postVerAsientosSIRSARP = async (req, res) => {
  try {
    var _service_id = 6; // TitularidadSIRSARP
    const _datetime = new Date();
    //
    var {
      transaccion, idImg, tipo, nroTotalPag, nroPagRef, pagina,
      user_key, s_key, mac=null, longitude = null, latitude = null, environment = null
    } = req.body;
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

    // VER ASIENTOS    
    const result_Asientos = await pideService.ServiceverAsientosSIRSARP(transaccion, idImg, tipo, nroTotalPag, nroPagRef, pagina);
    
    // RESULT QUERY JSON A STRING    
    let _result_query = JSON.stringify(result_Asientos);

    // FORMAT PARAMETER
    let _search_parameter = `transaccion: ${transaccion}, idImg: ${idImg}, tipo: ${tipo}, nroTotalPag: ${nroTotalPag}, nroPagRef: ${nroPagRef}, pagina: ${pagina}`;

    // CONTRUIR OBJETO LOG_CONGULTA
    let _data_log = {
      "service_id": _service_id,
      "user_id": Authorized[0].USER_ID,
      "search_parameter": _search_parameter,
      "system_id": result_system[0].SYSTEM_ID,
      "s_key": s_key,
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
    return res.status(200).send(success(["Success"], result_Asientos, 200));
    // return res.status(200).send(success(["Success"], result_query, 200));
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
  getOficinas,
  postQueryPJRazonSocial,
  postTitularidadSIRSARP,
  postListarAsientosSIRSARP,
  postVerAsientosSIRSARP,
  postDetalleRPVExtra
};