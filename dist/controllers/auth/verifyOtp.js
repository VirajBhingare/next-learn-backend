"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = void 0;
const prismaClient_1 = require("../../prismaClient");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.JWT_SECRET || "apNpq9qw5XfMVYTmjTwz2O";
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const user = yield prismaClient_1.prisma.user.findUnique({ where: { email } });
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
    yield prismaClient_1.prisma.user.update({
        where: { email },
        data: { otp: null, otpExpiry: null },
    });
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    res.json({ message: "OTP verified", token });
    res.status(202).json({ message: "OTP verification successful", token });
});
exports.verifyOtp = verifyOtp;
