// import { PassportService } from "../modules/passport/services";
// const passportService = PassportService.getInstance();
// import { HttpStatusEnum, ResCodesEnum } from '../utils';

// import { HelperPassportService } from "../modules/passport/helperPassport";
// const helperPassportService = HelperPassportService.getInstance();

// export async function verifyToken(req, res, next) {
//   next();
// }

export async function verifyToken(req, res, next) {

  try {

    // const token = req.headers['x-access-token'];
    // if (!token) {
    //   return res.status(HttpStatusEnum.UNAUTHORIZED).json({
    //     success: false,
    //     messages: ['No envió token'],
    //     code: [ResCodesEnum.MISSING_TOKEN],
    //   });
    // }

    // const data = await helperPassportService.decriptData(token);
    // console.info(data);
    // const bootKey = await passportService.fnApiSeguridadControlBoot();
    // const result = await passportService.fnApiAuthorizationIsAuthorized(bootKey, data);
    // if (result.HasErrors) {
    //   return res.status(HttpStatusEnum.UNAUTHORIZED).json({
    //     success: false,
    //     messages: ['Token expirado o inválido'],
    //     code: [ResCodesEnum.INVALID_EXPIRED_TOKEN],
    //     data: result
    //   });
    // }

    // if (!result.HasErrors) {
    //   if(result.Data[0].ESTA_AUTORIZADO == false){
    //     return res.status(HttpStatusEnum.UNAUTHORIZED).json({
    //       success: false,
    //       messages: ['No autorizado'],
    //       code: [ResCodesEnum.INVALID_EXPIRED_TOKEN],
    //       data: result
    //     });
    //   }
    // }

    next();

  } catch (error) {
    console.log(error);
    if (error.code === 'ETIMEDOUT') {
      return res.status(408).send({
        messages: ['Tiempo de consulta excedido'],
        code: ["4008"],
      });
    }   

    return res.status(401).json({
      success: false,
      messages: ['Token inválido'],
      code: [8008],
      data: []
    }); 
    
  }
}
