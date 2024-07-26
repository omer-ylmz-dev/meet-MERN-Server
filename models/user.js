import mongoose from "mongoose"



const UserSchema = new mongoose.Schema({
	email:{
		type:String,
		require:true,
		unique:true,
		trim:true
	},
	username:{
		type:String,
		require:true,
		unique:true,
		trim:true
	},
	passw:{
		type:String,
		require:true
	},
	profilePicture:{
		type:String,
		trim:true,
	},
	isAgreed:{
		type:Boolean,
		require:true
	},
	followers:[String],
	followings:[String]
},{timestamps:true})





export default mongoose.model("User",UserSchema)

