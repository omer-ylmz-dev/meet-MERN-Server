import express from "express"
const router = express.Router()

import {
	followUser,
	getUserProfile,
	searchUser
} from "../controllers/user.js"


import {verifyToken} from "../middleware/verifyToken.js"


router.put("/follow",verifyToken,followUser)
router.get("/get-user-profile/:username",getUserProfile)
router.post("/search-user/:searchTag",searchUser)


export default router