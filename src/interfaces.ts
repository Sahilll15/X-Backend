export interface JWTUSER{
    id:String,
    email:String
}

export interface GraphQLContext{
    user?: JWTUSER
}