import { Router, type IRouter } from "express";
import healthRouter from "./health";
import pcAdvisorRouter from "./pc-advisor";

const router: IRouter = Router();

router.use(healthRouter);
router.use(pcAdvisorRouter);

export default router;
