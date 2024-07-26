import express from "express"
const router = express.Router()

import {
	createPost,
	deletePost,
	likePost,
	writeComment,
	getTimelinePosts,
	getPost
} from "../controllers/post.js"

import {verifyToken} from "../middleware/verifyToken.js"



router.post("/create",verifyToken,createPost)
router.delete("/delete/:postID",verifyToken,deletePost)
router.put("/like",verifyToken,likePost)
router.put("/write-comment",verifyToken,writeComment)
router.get("/get-timeline/:currentUser",verifyToken,getTimelinePosts)
router.get("/get-post/:postID",getPost)


export default router