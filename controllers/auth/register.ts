import { Request, RequestHandler, Response } from "express";
import { prisma } from "../../prismaClient";
import { randomBytes } from "crypto";
import { generateHashedPassword } from "../../middleware/auth";

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
