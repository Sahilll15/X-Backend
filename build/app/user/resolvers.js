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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const db_1 = require("../../clients/db");
const jwt_1 = __importDefault(require("../../services/jwt"));
const user_1 = __importDefault(require("../../services/user"));
const queries = {
    verifyGoogleToken: (parent_1, _a) => __awaiter(void 0, [parent_1, _a], void 0, function* (parent, { token }) {
        const googleAuthUrl = new URL('https://oauth2.googleapis.com/tokeninfo');
        googleAuthUrl.searchParams.append('id_token', token);
        const response = yield fetch(googleAuthUrl.toString());
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = yield response.json();
        console.log(data);
        const checkUserExists = yield db_1.prismaclient.user.findUnique({
            where: {
                email: data.email
            }
        });
        if (!checkUserExists) {
            yield db_1.prismaclient.user.create({
                data: {
                    email: data.email,
                    firstName: data.given_name,
                    lastName: data.family_name,
                    profileImageURL: data.picture,
                }
            });
        }
        const userInDb = yield db_1.prismaclient.user.findUnique({
            where: {
                email: data.email
            }
        });
        if (!userInDb) {
            throw new Error("User Not Found");
        }
        const usertoken = yield jwt_1.default.generateToken(userInDb);
        return usertoken;
    }),
    getCurrentUser: (parent, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        console.log(ctx);
        const id = (_b = ctx.user) === null || _b === void 0 ? void 0 : _b.id;
        if (!id) {
            return null;
        }
        const user = yield db_1.prismaclient.user.findUnique({
            where: {
                id
            }
        });
        return user;
    }),
    getUserById: (parent_2, _c) => __awaiter(void 0, [parent_2, _c], void 0, function* (parent, { userId }) {
        const user = yield db_1.prismaclient.user.findUnique({
            where: {
                id: userId
            }
        });
        return user;
    })
};
const extraResolvers = {
    User: {
        tweets: (parent) => db_1.prismaclient.tweet.findMany({
            where: {
                authorId: parent.id
            }
        }),
        followers: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield db_1.prismaclient.follows.findMany({
                where: {
                    following: {
                        id: parent.id
                    }
                },
                include: {
                    following: true,
                    follower: true
                }
            });
            return result.map((el) => el.follower);
        }),
        following: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield db_1.prismaclient.follows.findMany({
                where: {
                    follower: {
                        id: parent.id
                    }
                },
                include: {
                    following: true,
                    follower: true
                }
            });
            return result.map((el) => el.following);
        })
    }
};
const mutations = {
    followUser: (parent_3, _d, ctx_1) => __awaiter(void 0, [parent_3, _d, ctx_1], void 0, function* (parent, { to }, ctx) {
        if (!ctx.user || !ctx.user.id)
            throw new Error('unauthenticated');
        yield user_1.default.followUser(ctx.user.id, to);
        return true;
    }),
    unfollowUser: (parent_4, _e, ctx_2) => __awaiter(void 0, [parent_4, _e, ctx_2], void 0, function* (parent, { to }, ctx) {
        if (!ctx.user || !ctx.user.id)
            throw new Error('unauthenticated');
        yield user_1.default.unfollowUser(ctx.user.id, to);
        return true;
    })
};
exports.resolvers = {
    queries,
    extraResolvers,
    mutations
};
