"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = void 0;
exports.types = `#graphql

type CreateTweetData{
    content: String
    imageURL:String
}

input CreateTweetInput {
    content: String!
    imageURL: String
  }

type Tweet{
    id:ID!
    content:String!
    imageURL:String

    author:User

}

`;
