import { Router } from "express";
const sunatRouter = Router();
import controller from "./controller";
import { setHeaders } from '../../middlewares';
// import {queryReniec} from '../../validators/dnii';
sunatRouter.post("/ruc",[setHeaders], controller.postQuerySunat);

export default sunatRouter;