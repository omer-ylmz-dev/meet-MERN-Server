import userSchema from "../models/user.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"



// ******************************************************************


export const login = async(req,res) => {
	try{
		const {email,passw} = req.body
		const user = await userSchema.findOne({email})
		
		if(!user){
			return res.status(401).json({message: "Invalid mail address or password"})
		}
		const passComparing = await bcrypt.compare(passw, user.passw)
		
		if(!passComparing){
			return res.status(401).json({message: "Invalid mail address or password"})
		}
		
		
		
		
		const accessToken = jwt.sign({username: user.username}, process.env.ACCESS_SESSION_SECRET, {expiresIn: "10m"}) 
		const refreshToken = jwt.sign({username: user.username}, process.env.REFRESH_SESSION_SECRET, {expiresIn: "1h"}) 
		
		res.cookie('meet_session_refresh', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge:3600000 });
		res.cookie('meet_session_access', accessToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge:600000 });
		
		
	
		res.status(200).json({
			message: "User has Logged In", 
			profilePicture: user?.profilePicture, 
			accessToken:accessToken
		})
		
	}catch(err){
		return res.status(500).json({message: err.message})
	}
}


// ******************************************************************



export const register = async(req,res) => {
	try{
		const {email,username,passw,isAgreed} = req.body
		
		const mailCheck = await userSchema.findOne({email})
		const userCheck = await userSchema.findOne({username})
		
		
		if(mailCheck){
			return res.status(409).json({message: "This mail address is already use"})
		}
		if(!isEmailAddress(email)){
			return res.status(400).json({message: "This mail address is incorrect"})
		}
		if(userCheck){
			return res.status(409).json({message: "This username already exists"})
		}
		if(!isCorrectPassword(passw)){
			return res.status(400).json({message: "Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, no space, and it must be 8-16 characters long"})
		}
		if(isAgreed === false){
			return res.status(400).json({message: "Please agree with our terms"})
		}
		
		const passHash = await bcrypt.hash(passw,12)
		const user = await userSchema.create({email,username,passw:passHash,isAgreed,profilePicture:"profile.jpg",followers:[],followings:[]})
		
		
		
		if(user){
			const accessToken = jwt.sign({username: user.username}, process.env.ACCESS_SESSION_SECRET, {expiresIn: "10m"}) 
			const refreshToken = jwt.sign({username: user.username}, process.env.REFRESH_SESSION_SECRET, {expiresIn: "1h"}) 
			
			res.cookie('meet_session_refresh', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge:3600000 });
			res.cookie('meet_session_access', accessToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge:600000 });
			
					
			res.status(200).json({
				message: "User has created", 
				profilePicture: user?.profilePicture, 
				accessToken:accessToken
			})
		}else{
			return res.status(500).json({message: "User has not created. There is some mistakes. Try again"})
		}
		
		
	}catch(err){
		return res.status(500).json({message: err.message})
	}
}



// ******************************************************************



export const logout = async(req,res) => {
	try{
		if(!req.cookies){
			return res.status(500).json("There is some mistakes")
		}
		
		res.clearCookie('meet_session_refresh', { httpOnly: true, sameSite: 'None', secure: true });
		res.clearCookie('meet_session_access', { httpOnly: true, sameSite: 'None', secure: true });
		
		return res.status(200).json({message: "User has Logged Out"})
		
	}catch(err){
		return res.status(500).json({message: err.message})
	}
}



// ******************************************************************




export const verifyRefreshToken = async(req,res) => {
	
		if(!req.cookies.meet_session_access){
			jwt.verify(req.cookies.meet_session_refresh, process.env.REFRESH_SESSION_SECRET, async(err,decoded) => {
				if(err){
					return res.status(500).json("Your session is over! (refreshToken Verify and create Accesstoken)")
				}else{
					const user = await userSchema.findOne({username:decoded.username}).select("profilePicture  followers followings")
					
					
					const newAccessToken = jwt.sign({username: decoded.username}, process.env.ACCESS_SESSION_SECRET, {expiresIn: "10m"}) 
					
					res.cookie('meet_session_access', newAccessToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge:600000 });
					
					return res.status(200).json({
						message:"Your New Token is: ", 
						profilePicture:user?.profilePicture, 
						accessToken:newAccessToken
					})
					
				}
			})
			
		}else{
			
			const decoded = jwt.decode(req.cookies.meet_session_access)
			const user = await userSchema.findOne({username:decoded.username}).select("profilePicture followers followings")
			
			return res.status(200).json({
				message:"Your Token is: ", 
				profilePicture:user?.profilePicture, 
				accessToken:req.cookies.meet_session_access
			})
			
			
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