"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tweet = void 0;
const types_1 = require("./types");
const resolvers_1 = require("./resolvers");
const mutations_1 = require("./mutations");
const queries_1 = require("./queries");
exports.Tweet = {
    types: types_1.types,
    resolvers: resolvers_1.resolvers,
    mutations: mutations_1.mutations,
    queries: queries_1.queries
};
