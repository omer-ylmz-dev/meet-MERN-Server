import express from "express"
import cors from "cors"
import multer from "multer"
import path from "node:path"

import bodyParser from "body-parser"
import cookieParser from "cookie-parser"


import authRouter from "./routes/auth.js"
import postRouter from "./routes/post.js"
import settingsRouter from "./routes/settings.js"
import userRouter from "./routes/user.js"

import {verifyToken} from "./middleware/verifyToken.js"
import credentials from "./middleware/credentials.js"

import {databaseConnection} from "./config/databaseConnection.js"

import {fileURLToPath} from "url"

const app = express()



const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


app.use("/images", express.static(path.join(__dirname, "public/images")))



databaseConnection()

app.use(credentials);


app.use(cors({
	origin:process.env.CLIENT_URL,
	credentials:true
}))




app.use(cookieParser());

app.use(bodyParser.json({limit:"30mb",extended:true}))
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))



const storage = multer.diskStorage({
	destination: (req,file,cb) => {
		cb(null, "public/images")
	},
	filename: (req,file,cb) => {	
		cb(null, req.body.contentName)
	}
})


const upload = multer({storage})




app.use("/auth",authRouter)
app.use("/post",upload.single("content"),postRouter)
app.use("/settings",upload.single("content"),settingsRouter)
app.use("/user",userRouter)







app.listen(process.env.PORT,() => {
	console.log("Server is working")
})