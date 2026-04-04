import { Router } from "express";
import { getExperiment } from "../controllers/experiment.controller.js";

const router = Router();

router.get("/", getExperiment);

export default router;
