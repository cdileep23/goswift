"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    userId: {
        type: Number,
        required: true,
    },
    comments: [
        {
            id: {
                type: Number,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            body: {
                type: String,
                required: true,
            },
        },
    ],
}, { _id: false });
exports.postModel = mongoose_1.default.model('Post', postSchema);
