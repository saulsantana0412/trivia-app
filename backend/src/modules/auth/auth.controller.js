import { signAccessToken, verifyToken } from "../../utils/jwt.js"
import { errorResponse, successResponse } from "../../utils/response.js"
import { AuthService } from "./auth.service.js"
import { generateTokens } from "../../utils/jwt.js"
import { asyncHandler } from "../../utils/asyncHandler.js"

export class AuthController {
    
    static login = asyncHandler(async(req, res) => {
        const { email, password } = req.body
        const loggedUser = await AuthService.login({email, password})

        if(!loggedUser) return errorResponse(res, 'Invalid email or password. Please try again.', 401)
        
        const payload = {id: loggedUser.id, email: loggedUser.email}
        const tokens = generateTokens(payload)

        res.cookie('refresh_token', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        successResponse(res, {accessToken: tokens.accessToken})
    })

    static register = asyncHandler( async(req, res) => {
        const data = req.body

        const user = await AuthService.register({data})
        if(user === 'email duplicated') return errorResponse(res, 'This email is already in use. Try resetting your password.', 409)

        if(user === 'alias duplicated') return errorResponse(res, 'This alias is already taken. Try another one.', 409)
        
        const payload = {id: user.id, email: user.email}

        const tokens = generateTokens(payload)
        
        res.cookie("refresh_token", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        successResponse(res, {accessToken: tokens.accessToken})
    })

    static refreshToken = asyncHandler( async(req, res) => {
        const refreshToken = req.cookies.refresh_token
        
        if(!refreshToken) return errorResponse(res, 'No refresh token found. Please log in again.', 403)
        
        try {
            const user = verifyToken(refreshToken)
            
            if(!user) return errorResponse(res, 'Invalid Refresh Token.', 403)
    
            const newAccessToken = signAccessToken({id: user.id, email: user.email})
            successResponse(res, {accessToken: newAccessToken})
        } catch (error) {
            return errorResponse(res, 'Token verification failed. Try logging in aggain', 403)
        }
    })

    static logout = asyncHandler( async(req, res) => {
        res.clearCookie('refresh_token')
        successResponse(res, 'Logout successful.')
    })
}