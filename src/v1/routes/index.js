import { Router } from "express";
const router = Router();
import pideRouter from "../../modules/reniec/routes";
import sunatRouter from "../../modules/sunat/routes";
import sunarpRouter from "../../modules/sunarp/routes";
router.use("/reniec", pideRouter);
router.use("/sunat", sunatRouter);
router.use("/sunarp", sunarpRouter);
export default router;