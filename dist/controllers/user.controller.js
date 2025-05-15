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
exports.getUserByUserId = exports.deleteUserByUserId = exports.deleteAllUsers = exports.loadData = void 0;
const user_model_1 = require("../models/user.model");
const post_model_1 = require("../models/post.model");
const comment_model_1 = require("../models/comment.model");
const axios_1 = __importDefault(require("axios"));
const loadData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersResponse = yield axios_1.default.get("https://jsonplaceholder.typicode.com/users");
        const postsResponse = yield axios_1.default.get("https://jsonplaceholder.typicode.com/posts");
        const commentsResponse = yield axios_1.default.get("https://jsonplaceholder.typicode.com/comments");
        yield user_model_1.UserModel.deleteMany();
        yield post_model_1.postModel.deleteMany();
        yield comment_model_1.commentModel.deleteMany();
        console.log("deleted existing one");
        const comments = commentsResponse.data;
        yield comment_model_1.commentModel.insertMany(comments);
        console.log("completed comments");
        const users = usersResponse.data;
        yield user_model_1.UserModel.insertMany(users);
        console.log("completed User");
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
        console.log("completed post");
        return res.status(200).json({
            message: "Added Data to the Database",
            success: true,
        });
    }
    catch (err) {
        console.error("Error loading data:", err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
});
exports.loadData = loadData;
const deleteAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resposeUsers = yield user_model_1.UserModel.deleteMany();
        const responsePosts = yield post_model_1.postModel.deleteMany();
        const responseComments = yield comment_model_1.commentModel.deleteMany();
        return res.status(200).json({
            success: true,
            message: "Delete All Users With Posts &  Comments"
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
});
exports.deleteAllUsers = deleteAllUsers;
const deleteUserByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.userId);
        const result = yield user_model_1.UserModel.deleteOne({ id: userId });
        if (result.deletedCount === 0) {
            return res
                .status(404)
                .json({ message: "User not found", sucesss: false });
        }
        const userPosts = yield post_model_1.postModel.find({ userId });
        yield post_model_1.postModel.deleteMany({ userId });
        yield comment_model_1.commentModel.deleteMany({
            postId: { $in: userPosts.map((post) => post.id) },
        });
        return res.status(200).json({
            success: true,
            message: "Deleted User along with his posts and their comments"
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
});
exports.deleteUserByUserId = deleteUserByUserId;
const getUserByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const userExists = yield user_model_1.UserModel.findOne({ id: userId });
        if (!userExists) {
            return res
                .status(404)
                .json({ message: "User not found", sucesss: false });
        }
        const posts = yield post_model_1.postModel.find({
            userId
        });
        return res.status(200).json({
            success: true,
            message: "Fetched Userdata successfully",
            data: Object.assign(Object.assign({}, userExists), { posts })
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
});
exports.getUserByUserId = getUserByUserId;
