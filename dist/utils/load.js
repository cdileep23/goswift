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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const user_model_1 = require("../models/user.model");
const post_model_1 = require("../models/post.model");
const comment_model_1 = require("../models/comment.model");
const loadData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersResponse = yield axios_1.default.get("https://jsonplaceholder.typicode.com/users");
        const postsResponse = yield axios_1.default.get("https://jsonplaceholder.typicode.com/posts");
        const commentsResponse = yield axios_1.default.get("https://jsonplaceholder.typicode.com/comments");
        yield user_model_1.UserModel.deleteMany();
        yield post_model_1.postModel.deleteMany();
        yield comment_model_1.commentModel.deleteMany();
        const comments = commentsResponse.data;
        yield comment_model_1.commentModel.insertMany(comments);
        const users = usersResponse.data;
        yield user_model_1.UserModel.insertMany(users);
        const posts = postsResponse.data.map((post) => {
            const postComments = commentsResponse.data
                .filter((comment) => comment.postId === post.id)
                .map((_a) => {
                var { postId } = _a, rest = __rest(_a, ["postId"]);
                return rest;
            });
            return Object.assign(Object.assign({}, post), { comments: postComments });
        });
        yield post_model_1.postModel.insertMany(posts);
        console.log("Data loaded successfully!");
    }
    catch (err) {
        console.error("Error loading data:", err);
    }
});
exports.default = loadData;
