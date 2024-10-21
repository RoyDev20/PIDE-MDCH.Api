// import compression from "compression";
import express from "express";
import xss from "xss-clean";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import throttler from "express-rate-limit";
var bodyParser = require('body-parser')
const path = require('path');

// // RUTA APISERVICE
import indexRoutes from "./v1/routes/index";

// TAREAS PROGRAMADAS
// const scheduler = require('./scheduler.js');
import scheduler from "./scheduledTasks/scheduler";

const app = express();
// Options CORS
const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN_URL || "*",
  methods: process.env.ALLOWED_REQUEST_METHODS,
};

// Opciones de throttler
// const throttlerOptions = {
//   windowMs: 1000 * 60 * Number(process.env.THROTTLER_WINDOW_MINUTES || 1), // N° minutos
//   max: Number(process.env.THROTTLER_MAX_CONSULTS || 1000), // Limita cada IP a 100 solicitudes por `ventana` (aquí, por 15 minutos)
// };

app.use(cors(corsOptions));
// app.use(xss()); // Data Sanitization  against XSS
// app.use(throttler(throttlerOptions)); // limita las conexiones
app.use(express.json()); // parsea todas la rutas
app.use(express.urlencoded({ extended: false })); // parsea todas la rutas
app.use(morgan("common"));
// app.use(helmet());
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
// app.set("trust proxy", true);

app.use(bodyParser.urlencoded({ extended: true, }));



app.use(express.static(path.resolve(__dirname, '../public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

app.get("/", (req, res) => {
  res.send("APIREST PIDE - MDCH");
  // res.sendFile(path.resolve(__dirname, '../public', 'index.html'));

  
});

app.use("/api/v1/", indexRoutes);

export default app;
