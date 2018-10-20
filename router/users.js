const userRouter = require('express').Router();
const { getUserByUsername, getUsers } = require('../controllers/users')

userRouter.route('/:username')
    .get(getUserByUsername)

userRouter.route('/')
    .get(getUsers)

module.exports = userRouter;