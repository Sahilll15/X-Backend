import { User } from "@prisma/client";
import { prismaclient } from "../clients/db";
import jwt from 'jsonwebtoken'


const JWT_SECRET='dasdasdsa'

class JWTSERVICE{


    public static async generateToken(user:User){
    

        const payload={
            id:user?.id,
            email:user?.email
        }

        return jwt.sign(payload,JWT_SECRET,{expiresIn:'1h'})
    }

}

export default JWTSERVICE