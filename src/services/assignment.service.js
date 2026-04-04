import { hashToUnitInterval } from "../utils/hash.js";

const validateVariants = (variants) => {
  if (!Array.isArray(variants) || variants.length === 0) {
    throw new Error("Experiment must define at least one variant.");
  }

  const totalWeight = variants.reduce((sum, variant) => sum + variant.weight, 0);

  if (totalWeight <= 0) {
    throw new Error("Variant weights must sum to a positive value.");
  }

  return totalWeight;
};

export const assignVariant = ({ experimentKey, userId, salt, variants }) => {
  const totalWeight = validateVariants(variants);
  const hashInput = `${experimentKey}:${salt}:${userId}`;
  const unitValue = hashToUnitInterval(hashInput);
  const bucket = unitValue * 100;

  let cumulativeWeight = 0;

  for (const variant of variants) {
    cumulativeWeight += (variant.weight / totalWeight) * 100;

    if (bucket <= cumulativeWeight || variant === variants.at(-1)) {
      return {
        variant,
        bucket: Number(bucket.toFixed(6)),
        hashInput
      };
    }
  }

  throw new Error("Failed to assign a variant.");
};
