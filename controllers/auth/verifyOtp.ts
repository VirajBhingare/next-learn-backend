import { Request, Response, RequestHandler } from "express";
import { prisma } from "../../prismaClient";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "apNpq9qw5XfMVYTmjTwz2O";

export const verifyOtp: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { email, otp } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(400).json({ error: "User not found." });
    return;
  }
  if (!user.otp || !user.otpExpiry) {
    res.status(400).json({ error: "Something went wrong. OTP not generated" });
    return;
  }
  const now = new Date();
  if (otp !== user.otp || user.otpExpiry < now) {
    res.status(401).json({ error: "Invalid or expired OTP" });
    return;
  }
  await prisma.user.update({
    where: { email },
    data: { otp: null, otpExpiry: null },
  });
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
  res.json({ message: "OTP verified", token });
  res.status(202).json({ message: "OTP verification successful", token });
};
