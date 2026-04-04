const parsePort = (value) => {
  const parsed = Number.parseInt(value ?? "8080", 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 8080;
};

export const env = {
  port: parsePort(process.env.PORT),
  assignmentSalt: process.env.ASSIGNMENT_SALT ?? "devbytes-assignment-v1"
};
