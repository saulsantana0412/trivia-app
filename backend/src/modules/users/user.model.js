import { pool } from "../../config/db.js";

export class UserModel {

    static async getAll(){
        const [users] = await pool.query('SELECT id, alias, email FROM users')
        return users
    }

    static async create({data}){
        const {
            email, 
            password_hash,
            alias,
            avatar_url,
        } = data
    }

}