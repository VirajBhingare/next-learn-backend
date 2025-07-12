import { Router } from "express";
import { register } from "../../controllers/auth/register";
import { login } from "../../controllers/auth/login";
import { verifyOtp } from "../../controllers/auth/verifyOtp";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);

export default router;
