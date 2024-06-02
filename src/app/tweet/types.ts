export const types=`#graphql

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

`