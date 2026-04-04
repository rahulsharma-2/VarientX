import { getExperimentAssignment } from "../services/experiment.service.js";

export const getExperiment = (req, res, next) => {
  try {
    const debug = req.query.debug === "true";
    const payload = getExperimentAssignment(req.query.user_id, debug);
    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};
