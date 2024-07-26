import userSchema from "../models/user.js"
import postSchema from "../models/post.js"
import bcrypt from "bcrypt"



// ******************************************************************



export const getCurrentUserDetails = async(req,res) => {
	try{
		const {currentUser} = req.params
		const userDetails = await userSchema.find({username:currentUser}) 
		return res.status(200).json(userDetails[0])
	}catch(err){
		return res.status(500).json({message:err.message})
	}
}


// ******************************************************************



export const changeProfilePhoto = async(req,res) => {
	try{
		
		const {currentUser,contentName,content} = req.body
		const changingProcess = await userSchema.findOneAndUpdate({username:currentUser}, {profilePicture:contentName}, {new: true})
		res.status(200).json({message:"Profile photo has changed", picture:contentName})
	}catch(err){
		return res.status(500).json({message:err.message})
	}
}


// ******************************************************************



export const changeMailAddress = async(req,res) => {
	try{
	
		const {currentUser,newMailAddress} = req.body
		
		if(!isEmailAddress(newMailAddress)){
			return res.status(400).json({message: "This mail address is incorrect"})
		}
		
		const changingProcess = await userSchema.findOneAndUpdate({username:currentUser}, {$set:{email:newMailAddress}}, {new: true})
		res.status(200).json({message:"Mail address has changed"})
	}catch(err){
		return res.status(500).json({message:err.message})
	}
}


// ******************************************************************



export const changePassword = async(req,res) => {
	try{
		const {currentUser,newPassword} = req.body
		
		if(!isCorrectPassword(newPassword)){
			return res.status(400).json({message: "Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, no space, and it must be 8-16 characters long"})
		}
		
		const passHash = await bcrypt.hash(newPassword,12)
		
		const changingProcess = await userSchema.findOneAndUpdate({username:currentUser}, {$set:{passw:passHash}}, {new: true})
		res.status(200).json({message:"Password has changed"})
	}catch(err){
		return res.status(500).json({message:err.message})
	}
}



// ******************************************************************




export const deleteYourAccount = async(req,res) => {
	try{
		const {currentUser} = req.params
		const user = await userSchema.findOne({username:currentUser})
		const posts = await postSchema.find({username:user.username})
		
		if(user && posts){
			await postSchema.deleteMany({username:currentUser})
			await userSchema.findOneAndDelete({username:currentUser})
			
			res.clearCookie('meet_session_refresh', { httpOnly: true, sameSite: 'None', secure: true });
			res.clearCookie('meet_session_access', { httpOnly: true, sameSite: 'None', secure: true });
			return res.status(200).json({message:"Your account has been deleted"})
			
		}else{
			return res.status(500).json({message:"There is some mistakes.Try again"})
		}
		
	}catch(err){
		return res.status(500).json({message:err.message})
	}
}



// ******************************************************************



function isEmailAddress(mailAddress){
	let regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
	
	if(mailAddress.match(regex)) return true
	else return false
}



function isCorrectPassword(checkPassword){
	let regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.* ).{8,16}$/;
	
	if(checkPassword.match(regex)) return true
	else return false
}