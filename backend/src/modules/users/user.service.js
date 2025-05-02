import db from '../../../models/index.js';

const User = db.User

export class UserService{
    
    // TODO: get all users
    static async getAll(){
        const users = await User.findAll({attributes: ['id','alias','email', 'avatarUrl', 'passwordHash']})
        return users
    }

    // TODO: get user by id if is active

    // TODO: create new user
    // static async create({data}){
    //     const {email, alias, passwordHash, avatarUrl} = data
    //     const user = await User.create({email, alias, passwordHash, avatarUrl},{
    //         fields: ['email', 'alias', 'passwordHash', 'avatarUrl']
    //     })
    //     return user 
    // }

    // TODO: update user by id

    // TODO: desactivate user by id

    // TODO: login user

    // TODO: registrer user

    // TODO: get user stats
    
    // TODO: update avatar

    // TODO: update pasword

} 