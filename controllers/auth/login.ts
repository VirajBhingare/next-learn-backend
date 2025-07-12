import { RequestHandler, Request, Response } from "express";
import { prisma } from "../../prismaClient";
import { validatePassword, generateOtp } from "../../middleware/auth";

export const login: RequestHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !validatePassword(password, user.password)) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const otp = generateOtp();
  const expiry = new Date(Date.now() + 5 * 60 * 1000);
  await prisma.user.update({
    where: { email },
    data: { otp, otpExpiry: expiry },
  });

  console.log("OTP: ", otp);

  res.status(201).json({ message: "OTP Sent", userId: user.id });
};
