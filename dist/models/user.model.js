"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        street: {
            type: String,
            required: true,
        },
        suite: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        zipcode: {
            type: String,
            required: true,
        },
        geo: {
            lat: {
                type: String,
                required: true,
            },
            lng: {
                type: String,
                required: true,
            },
        },
    },
    phone: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        required: true,
    },
    company: {
        name: {
            type: String,
            required: true,
        },
        catchPhrase: {
            type: String,
            required: true,
        },
        bs: {
            type: String,
            required: true,
        },
    },
}, {
    _id: false
});
exports.UserModel = mongoose_1.default.model("User", userSchema);
