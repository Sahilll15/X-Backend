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
};
exports.resolvers = {
    queries
};
