import Post from "../models/post.js"
import userSchema from "../models/user.js"



// ******************************************************************




export const createPost = async(req,res) => {
	try{
		const userProfile = await userSchema.findOne({username:req.body.username})
		const newPost = await Post.create({...req.body,userDetails:userProfile._id})
			
		res.status(201).json({message:"The post has been created successfully", status:"OK"})
	}catch(err){
		res.status(500).json({message: err.message})
	}
}



// ******************************************************************





export const deletePost = async(req,res) => {
	try{
		const {postID} = req.params
		await Post.findByIdAndDelete(postID)
		res.status(200).json({message: "The post has been deleted."})
	}catch(err){
		res.status(500).json({message: err.message})
	}
}




// ******************************************************************



export const likePost = async(req,res) => {
	try{
		const {postID,user} = req.body
		const post = await Post.findById(postID)
		if(!post.likes.includes(user)){
			await post.updateOne({ $push: { likes: user }})
			res.status(200).json({message: "Post liked"})
		}else{
			await post.updateOne({ $pull: { likes: user }})
			res.status(200).json({message: "Post disliked"})
		}
	}catch(err){
		res.status(500).json({message: err.message})
	}
}




// ******************************************************************




export const writeComment = async(req,res) => {
	try{
		const {postID,username,comment,profilePicture,createdTime} = req.body
		const addComment = await Post.findById(postID)
		await addComment.updateOne({ $push: { comments: {username,comment,profilePicture,createdTime}}})
		res.status(200).json({message: "The comment has been added"})
	}catch(err){
		res.status(500).json({message: err.message})
	}
}



// ******************************************************************





export const getTimelinePosts = async(req,res) => {
	try{
		const {currentUser} = req.params
		const user = await userSchema.findOne({username:currentUser})
		const userPosts = await Post.find({username:currentUser}).populate({path:"userDetails",select:"profilePicture followers followings"})
		const posts = await Promise.all(
			user.followings.map((username) => {
				return Post.find({username}).populate({path:"userDetails",select:"profilePicture followers followings"})
			})
		)
		res.status(200).json(userPosts.concat(...posts))
	}catch(err){
		res.status(500).json({message: err.message})
	}
}



// ******************************************************************





export const getPost = async(req,res) => {
	try{
		const {postID} = req.params
		const post = await Post.findById(postID).populate({path:"userDetails",select:"profilePicture followers followings"})
		res.status(200).json(post)
	}catch(err){
		res.status(500).json({message: err.message})
	}
}




// ******************************************************************