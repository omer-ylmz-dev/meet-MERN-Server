import mongoose from "mongoose"


const PostSchema = new mongoose.Schema({
	username:{
		type:String,
		require:true,
		trim:true
	},
	description:{
		type:String,
		require:true,
		trim:true
	},
	location:{
		type:String,
		require:true,
		trim:true
	},
	contentName:{
		type:String,
		require:true,
		trim:true
	},
	likes:[String],
	comments:[{
		username:{
			type:String,
			require:true,
			trim:true
		},
		profilePicture:{
			type:String,
			require:true,
			trim:true
		},
		comment:{
			type:String,
			require:true,
			trim:true
		},
		createdTime:{
			type:String,
			require:true,
			trim:true
		}
	}],
	createdTime:{
		type:String,
		require:true,
		trim:true
	},
	userDetails:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'User'
	}
})




export default mongoose.model("Post",PostSchema)
