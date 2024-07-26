import express from "express"
const router = express.Router()

import {
	login,
	register,
	logout,
	verifyRefreshToken,
} from "../controllers/auth.js"


router.post("/login",login)
router.post("/register",register)
router.post("/logout",logout)
router.get("/verify-refresh-token",verifyRefreshToken)


export default router