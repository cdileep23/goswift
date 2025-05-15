"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
router.route('/load').get(user_controller_1.loadData);
router.route('/users').delete(user_controller_1.deleteAllUsers);
router.route('/users/:userId').get(user_controller_1.getUserByUserId).delete(user_controller_1.deleteUserByUserId);
exports.default = router;
