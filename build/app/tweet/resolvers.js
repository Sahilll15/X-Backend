"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const db_1 = require("../../clients/db");
const mutations = {
    createTweet: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { payload }, ctx) {
        if (!ctx.user) {
            throw new Error("Tweet not created");
        }
        try {
            const createdTweet = yield db_1.prismaclient.tweet.create({
                data: {
                    content: payload.content,
                    imageURL: payload.imageURL,
                    author: {
                        connect: {
                            id: ctx.user.id
                        }
                    }
                }
            });
            return createdTweet;
        }
        catch (error) {
            throw new Error(`Failed to create tweet: ${error.message}`);
        }
    })
};
const extraResolvers = {
    Tweet: {
        author: (parent) => db_1.prismaclient.user.findUnique({
            where: {
                id: parent.authorId
            }
        })
    }
};
const queries = {
    getAllTweets: () => {
        return db_1.prismaclient.tweet.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });
    }
};
exports.resolvers = {
    mutations,
    extraResolvers,
    queries
};
