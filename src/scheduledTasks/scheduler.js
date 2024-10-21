// const cron = require('node-cron');
import cron from 'node-cron';
const crypto = require('crypto');
import { getConnection, getConnection2, sql } from '../database/conecction';

import { SchedulerService } from "./services";
const schedulerService = SchedulerService.getInstance();

//  una tarea todos los días a las 2:30 a.m
cron.schedule('30 2 * * *', async () => {
  try {
    console.log('tarea todos los días a las 2:30 a.m');
    var users = await schedulerService.getUsersReniec();
    for (let i = 0; i < users.length; i++) {
      const el = users[i];
      // Generar 32 bytes aleatorios
      const randomBytes = crypto.randomBytes(32);
      // Convertir los bytes a una cadena en base 64
      const password = randomBytes.toString('base64');  
      // if (el.DOCUMENT_NUMBER == '72784658') {
        console.log(`USUARIO -> ${el.NAMES}, DNI :${el.DOCUMENT_NUMBER}`);
        console.log(`PASS_ACTUAL -> ${el.PASS}, PASWORD :${password}`);
        var _reult_change_pass = await schedulerService.changePasswordRENIEC(el.DOCUMENT_NUMBER, process.env.RUC_ENTITY, el.PASS, password);

        if (_reult_change_pass.actualizarcredencialResponse.return.coResultado === "0000") {
          var _res = await schedulerService.updatePasswordDb(password, el.USER_ID);
          console.log(`${_reult_change_pass.actualizarcredencialResponse.return.deResultado}`);
        }
        else{
          console.log(`${_reult_change_pass.actualizarcredencialResponse.return.deResultado}`);
        }
      // }
    }
  } catch (error) {
    console.error('Ocurrió un error durante la ejecución de la tarea programada:', error);
  }
});

// cron.schedule('*/30 * * * * *', () => {
//   try {
//     console.log('Tarea programada ejecutada CADA 30 SEGUNDOS .');
//   } catch (error) {
//     console.error('Ocurrió un error durante la ejecución de la tarea programada:', error);
//   }
// });

// cron.schedule('*/5 * * * * *', () => {
//   try {
//     console.log('Tarea programada ejecutada CADA 5 SEGUNDOS .');
//   } catch (error) {
//     console.error('Ocurrió un error durante la ejecución de la tarea programada:', error);
//   }
// });

export default cron;