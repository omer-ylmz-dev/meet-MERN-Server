import userSchema from "../models/user.js"
import postSchema from "../models/post.js"



export const followUser = async(req,res) => {
	 if (req.body.currentUser !== req.body.username){
		 try{
			 const user = await userSchema.findOne({username:req.body.username});
			 const currentUser = await userSchema.findOne({username:req.body.currentUser});
			 if(!user.followers.includes(req.body.currentUser)){
				await user.updateOne({ $push: { followers: req.body.currentUser } });
				await currentUser.updateOne({ $push: { followings: req.body.username } });
				return res.status(200).json({message:"User has been followed"});
			}else{
				await user.updateOne({ $pull: { followers: req.body.currentUser } });
				await currentUser.updateOne({ $pull: { followings: req.body.username } });
				return res.status(200).json({message:"User has been unfollowed"});
			}
		}catch(err){
			return res.status(500).json(err.message);
		}
	}else{
		return res.status(403).json({message:"You can't follow yourself"});
	}
}






export const getUserProfile = async(req,res) => {
	try{
		const {username} = req.params
		const user = await userSchema.findOne({ username: username });
		const posts = await postSchema.find({ username: user?.username }).sort({createdTime:-1});
		return res.status(200).json({
			contents:{
				posts:posts
			},
			details:{
				username:user.username,
				profilePicture:user?.profilePicture,
				followers: user?.followers,
				followings: user?.followings,
				postCount: posts?.length,
			}
		});
	}catch(err){
		res.status(500).json(err);
	}
}






export const searchUser = async(req,res) => {
	try{
		const {searchTag} = req.params
		const users = await userSchema.find({ username: {$regex : "^" + searchTag, $options: "si"}});
		return res.status(200).json(users)
	}catch(err){
		return res.status(500).json({message:err.message})
	}
}
