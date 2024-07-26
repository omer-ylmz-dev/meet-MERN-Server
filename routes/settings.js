import express from "express"
const router = express.Router()

import {
	getCurrentUserDetails,
	changeProfilePhoto,
	changeMailAddress,
	changePassword,
	deleteYourAccount
} from "../controllers/settings.js"




router.get("/get-current-user-details/:currentUser",getCurrentUserDetails)
router.patch("/change-profile-photo",changeProfilePhoto)
router.patch("/change-mail-address",changeMailAddress)
router.patch("/change-password",changePassword)
router.delete("/delete-your-account/:currentUser",deleteYourAccount)


export default router