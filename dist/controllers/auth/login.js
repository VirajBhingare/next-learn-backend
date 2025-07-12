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
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const prismaClient_1 = require("../../prismaClient");
const auth_1 = require("../../middleware/auth");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield prismaClient_1.prisma.user.findUnique({ where: { email } });
    if (!user || !(0, auth_1.validatePassword)(password, user.password)) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
    }
    const otp = (0, auth_1.generateOtp)();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);
    yield prismaClient_1.prisma.user.update({
        where: { email },
        data: { otp, otpExpiry: expiry },
    });
    console.log("OTP: ", otp);
    res.status(201).json({ message: "OTP Sent", userId: user.id });
});
exports.login = login;
