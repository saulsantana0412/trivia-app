import { verifyToken } from "../utils/jwt.js";

export function authMiddleware(req, res, next){
    const header = req.headers.authorization
    if(!header || !header.startsWith('Bearer ')){
        return res.status(401).json({message: 'Token requerido'})
    }

    const token = header.split(' ')[1]

    try{
        const user = verifyToken(token)
        console.log(user)
        req.user = user
        next()
    } catch(err){
        return res.status(401).json({message: 'Token invalido'})
    }
}