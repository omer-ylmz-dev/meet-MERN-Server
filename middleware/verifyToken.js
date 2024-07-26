import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({message:"Unauthorized!"})
    const token = authHeader.split(' ')[1];
    console.log("Bearer token: ",token)
    jwt.verify(
        token,
        process.env.ACCESS_SESSION_SECRET,
        (err, decoded) => {
            if (err) return res.status(401).json({message:"Invalid Token"})
            req.username = decoded.username
            next();
        }
    );
}


