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
exports.register = void 0;
const prismaClient_1 = require("../../prismaClient");
const crypto_1 = require("crypto");
const generateHashedPassword = (password, salt) => {
    const hash = (0, crypto_1.scryptSync)(password, salt, 64);
    return `${salt}:${hash.toString("hex")}`;
};
const validatePassword = (password, hashedPassword) => {
    const [salt, hashedKey] = hashedPassword.split(":");
    const hashUserInput = (0, crypto_1.scryptSync)(password, salt, 64).toString("hex");
    return hashUserInput === hashedKey;
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingUser = yield prismaClient_1.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        res.status(400).json({ error: "Email already in use" });
        return;
    }
    const salt = (0, crypto_1.randomBytes)(16).toString("hex");
    const hashedPassword = generateHashedPassword(password, salt);
    const user = yield prismaClient_1.prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    });
    res.status(201).json({ message: "User registered", userId: user.id });
});
exports.register = register;
