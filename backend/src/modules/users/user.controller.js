import { UserService } from "./user.service.js";

export class UserController {
    static async getAll(req, res, next){
        try{
            const users = await UserService.getAll()
            res.json(users)
        }catch(err){
            next(err)
        }
    }

    static async create(req, res, next){
        const data = req.body
        try{
            const user = UserService.create({data})
            res.json(user)
        }catch(err){
            next(err)
        }
    }
}