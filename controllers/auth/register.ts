import { Request, RequestHandler, Response } from "express";
import { prisma } from "../../prismaClient";
import { randomBytes, scryptSync } from "crypto";
import jwt from "jsonwebtoken";

const generateHashedPassword = (password: string, salt: string) => {
  const hash = scryptSync(password, salt, 64);
  return `${salt}:${hash.toString("hex")}`;
};

const validatePassword = (password: string, hashedPassword: string) => {
  const [salt, hashedKey] = hashedPassword.split(":");
  const hashUserInput = scryptSync(password, salt, 64).toString("hex");
  return hashUserInput === hashedKey;
};

export const register: RequestHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    res.status(400).json({ error: "Email already in use" });
    return;
  }

  const salt = randomBytes(16).toString("hex");
  const hashedPassword = generateHashedPassword(password, salt);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  res.status(201).json({ message: "User registered", userId: user.id });
};
