import { scryptSync } from "crypto";

export const generateHashedPassword = (
  password: string,
  salt: string
): string => {
  const hash = scryptSync(password, salt, 64);
  return `${salt}:${hash.toString("hex")}`;
};

export const validatePassword = (
  password: string,
  hashedPassword: string
): boolean => {
  const [salt, hashedKey] = hashedPassword.split(":");
  const hashUserInput = scryptSync(password, salt, 64).toString("hex");
  return hashUserInput === hashedKey;
};

export const generateOtp = (length: number = 6): string => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  return Math.floor(min + Math.random() * (min - max + 1)).toString();
};
