import crypto from "node:crypto";

export const hashToUnitInterval = (input) => {
  const digest = crypto.createHash("sha256").update(input).digest("hex");
  const slice = digest.slice(0, 8);
  const integer = Number.parseInt(slice, 16);

  return integer / 0xffffffff;
};
