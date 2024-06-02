import { User } from "@prisma/client";
import { prismaclient } from "../../clients/db";
import { GraphQLContext } from "../../interfaces";
import JWTSERVICE from "../../services/jwt";

type GoogleUser = {
    iss: string;
    azp: string;
    aud: string;
    sub: string;
    email: string;
    email_verified: string;
    nbf: string;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    iat: string;
    exp: string;
    jti: string;
    alg: string;
    kid: string;
    typ: string;
  };
  


  const queries = {
    verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
      const googleAuthUrl = new URL('https://oauth2.googleapis.com/tokeninfo');
      googleAuthUrl.searchParams.append('id_token', token);
  
      const response = await fetch(googleAuthUrl.toString());
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: GoogleUser = await response.json();
  
      console.log(data);

      const checkUserExists=await prismaclient.user.findUnique({
            where:{
                email:data.email
            }
      })

        if(!checkUserExists){
            await prismaclient.user.create({
                data:{
                    email:data.email,
                    firstName:data.given_name,
                    lastName:data.family_name,
                    profileImageURL:data.picture,
                }
            })
        }


        const userInDb=await prismaclient.user.findUnique({
            where:{
                email:data.email
            }
        
        })

        if(!userInDb){
                throw new Error ("User Not Found")
        }
        
        const usertoken=await JWTSERVICE.generateToken(userInDb)
        return usertoken

    },

    getCurrentUser:async(parent:any,args:any,ctx:GraphQLContext)=>{
        console.log(ctx);  
        const id: string | undefined = ctx.user?.id as string | undefined;

        if (!id) {
          return null;
        }

        const user = await prismaclient.user.findUnique({
          where: {
            id
          }
        })

        return user;
    }
  };
  

  const extraResolvers={
      User:{
        tweets:(parent:User)=> prismaclient.tweet.findMany({
          where:{
            authorId:parent.id
          }
        })
      }
  }

export const resolvers={
    queries,
    extraResolvers
}