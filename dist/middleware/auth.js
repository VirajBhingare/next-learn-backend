"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = exports.validatePassword = exports.generateHashedPassword = void 0;
const crypto_1 = require("crypto");
const generateHashedPassword = (password, salt) => {
    const hash = (0, crypto_1.scryptSync)(password, salt, 64);
    return `${salt}:${hash.toString("hex")}`;
};
exports.generateHashedPassword = generateHashedPassword;
const validatePassword = (password, hashedPassword) => {
    const [salt, hashedKey] = hashedPassword.split(":");
    const hashUserInput = (0, crypto_1.scryptSync)(password, salt, 64).toString("hex");
    return hashUserInput === hashedKey;
};
exports.validatePassword = validatePassword;
const generateOtp = (length = 6) => {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(min + Math.random() * (min - max + 1)).toString();
};
exports.generateOtp = generateOtp;
