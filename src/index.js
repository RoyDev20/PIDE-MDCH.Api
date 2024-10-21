import app from "./app";
import config from "./config";
const PORT = config.PORT;
const HOST = config.HOST;

const https = require("https");
const fs = require("fs");

// var https_options = {
//   key: fs.readFileSync(__dirname + "/ssl/private.key"),
//   cert: fs.readFileSync(__dirname + "/ssl/ServerCertificate.crt"),
//   ca: [
//     fs.readFileSync(__dirname + "/ssl/ServerCertificate.crt"),
//     fs.readFileSync(__dirname + "/ssl/chain.crt"),
//   ],
// };

// https.createServer(https_options, app).listen(PORT, function () {
//   console.log("Express server listening on port " + PORT);
// });

 app.listen(PORT,HOST, ()=>{
  console.log(`APP LISTENING ON http://${HOST}:${PORT}`);
}); 
