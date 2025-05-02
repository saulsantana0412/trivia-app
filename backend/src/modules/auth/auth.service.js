import db from "../../../models/index.js";
import { generateTokens } from "../../utils/jwt.js";
import { comparePassword } from "../../utils/auth.js";

const User = db.User

export class AuthService{

    static async login({email, password}) {

        const user = await User.findOne({where: {email}})
        if(!user) return null

        const isValid = comparePassword(password, user.passwordHash)
        if(!isValid) return null

        return user
    }

    static async register({data}) {
        const { email, alias, passwordHash, avatarUrl } = data

        const emailExists = await User.findOne({where: { email }})
        if(emailExists) return 'email duplicated'

        const aliasExists = await User.findOne({where: { alias }})
        if(aliasExists) return 'alias duplicated'

        try{
            const user = await User.create(
                { email, alias, passwordHash, avatarUrl }, 
                {fields: ['email', 'alias', 'passwordHash', 'avatarUrl']})
            return user;
        } catch(err){
            throw new Error('Database error during user creation');
        }
    }

}