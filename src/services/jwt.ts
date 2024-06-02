import { User } from "@prisma/client";
import { prismaclient } from "../clients/db";
import jwt from 'jsonwebtoken'
import { JWTUSER } from "../interfaces";


const JWT_SECRET='dasdasdsa'

class JWTSERVICE{


    public static async generateToken(user:User){
        
    

        const payload:JWTUSER={
            id:user?.id,
            email:user?.email
        }

        return jwt.sign(payload,JWT_SECRET,{expiresIn:'1h'})
    }


    public static deCodeToken(token:string){
        try {
            return jwt.verify(token,JWT_SECRET) as JWTUSER;
        } catch (error) {
            return null
        }
    }

}



export default JWTSERVICE