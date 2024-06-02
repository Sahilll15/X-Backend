import { connect } from "http2";
import { prismaclient } from "../../clients/db";
import { GraphQLContext } from "../../interfaces";



interface CreateTweetPayload{
        content: string;
        imageURL?:string;
    
    
}


const mutations = {
    createTweet: async (parent: any, { payload }: { payload: CreateTweetPayload }, ctx: GraphQLContext) => {
        if (!ctx.user) {
            throw new Error("Tweet not created");
        }

        try {
            const createdTweet = await prismaclient.tweet.create({
                data: {
                    content: payload.content,
                    imageURL: payload.imageURL,
                    author: {
                        connect: {
                            id: ctx.user.id as string
                        }
                    }
                }
            });
            
            return createdTweet;
        } catch (error :any) {
            throw new Error(`Failed to create tweet: ${error.message}`);
        }
    }
};


export const resolvers={
    mutations
}