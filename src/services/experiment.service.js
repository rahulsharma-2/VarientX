import { activeExperiment } from "../config/experiments.js";
import { env } from "../config/env.js";
import { assignVariant } from "./assignment.service.js";

const normalizeUserId = (userId) => `${userId ?? ""}`.trim();

export const getExperimentAssignment = (userId, debug = false) => {
  const normalizedUserId = normalizeUserId(userId);

  if (!normalizedUserId) {
    const error = new Error("Query parameter 'user_id' is required.");
    error.statusCode = 400;
    throw error;
  }

  if (activeExperiment.status !== "active") {
    const error = new Error("No active experiment is currently available.");
    error.statusCode = 503;
    throw error;
  }

  const { variant, bucket, hashInput } = assignVariant({
    experimentKey: activeExperiment.key,
    userId: normalizedUserId,
    salt: env.assignmentSalt,
    variants: activeExperiment.variants
  });

  const response = {
    data: {
      experiment: {
        key: activeExperiment.key,
        name: activeExperiment.name
      },
      user: {
        id: normalizedUserId
      },
      assignment: {
        variant: variant.key,
        bucket
      },
      config: variant.config
    },
    meta: {
      deterministic: true
    }
  };

  if (debug) {
    response.meta.debug = {
      assignmentSalt: env.assignmentSalt,
      hashInput,
      variantWeights: activeExperiment.variants.map(({ key, weight }) => ({
        key,
        weight
      }))
    };
  }

  return response;
};
