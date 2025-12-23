import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { CONFIG } from "../../config";
const otpGenerator = require("otp-generator");

export const createAccessToken = (user: { id: number; email: string, role:string }) => {
    return jwt.sign(user, CONFIG.ACCESS_TOKEN_SECRET, {
        expiresIn: CONFIG.ACCESS_TOKEN_EXPIRATION as unknown as number,
    });
};

export const createRefreshToken = (user: { email: string }) => {
    return jwt.sign(user, CONFIG.REFRESH_TOKEN_SECRET, {
        expiresIn: CONFIG.REFRESH_TOKEN_EXPIRATION as unknown as number,
    });
};

export const createPassword = async (password?: string) => {
    if (!password) return null;
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const generateOtp = () => {
    return parseInt(
        otpGenerator.generate(4, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        })
    );
};
