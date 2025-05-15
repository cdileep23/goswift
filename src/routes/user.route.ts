import express, { Router } from "express"

import { addUser, deleteAllUsers, deleteUserByUserId, getUserByUserId, getUsers, loadData } from "../controllers/user.controller"

const router:Router=express.Router()

router.route('/load').get(loadData)
router.route('/users').delete(deleteAllUsers).post(addUser).get(getUsers)
router.route('/users/:userId').get(getUserByUserId).delete(deleteUserByUserId)

export default router