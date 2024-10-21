const path = require('path');
import {config} from 'dotenv';
config();
config({ path: path.resolve(__dirname, `../environments/${process.env.NODE_ENV}.env`)});
console.info("process.env.PORT: ",process.env.PORT);
export default{
    PORT : process.env.PORT || 3055,
    NODE_ENV : process.env.NODE_ENV || 'development',
    HOST : process.env.HOST || 'localhost',
    conecctionSql : {
        user : `${process.env.DB_USER}`,
        password : `${process.env.DB_PASSWORD}`,
        server : `${process.env.DB_SERVER}`,
        database :  `${process.env.DB_DATABASE}`,
    },
    conecctionSql2 : {
        user : `${process.env.DB2_USER}`,
        password : `${process.env.DB2_PASSWORD}`,
        server : `${process.env.DB2_SERVER}`,
        database :  `${process.env.DB2_DATABASE}`,
    }
}