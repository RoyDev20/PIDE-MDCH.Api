import { Router } from "express";
const pideRouter = Router();
import controller from "./controller";

import { setHeaders } from '../../middlewares';
import {queryReniec} from '../../validators/dnii';
pideRouter.post("/dni",[setHeaders],queryReniec, controller.postQueryReniec);

export default pideRouter;