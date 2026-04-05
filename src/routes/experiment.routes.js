import { Router } from "express";
import { getExperiment } from "../controllers/experiment.controller.js";
import { validateExperimentQuery } from "../middleware/experiment-validation.middleware.js";

const router = Router();

router.get("/", validateExperimentQuery, getExperiment);

export default router;
