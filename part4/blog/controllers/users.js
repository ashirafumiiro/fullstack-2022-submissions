const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { body, validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

usersRouter.post('/',
    [
        body('username', 'username must be 3 characters or more').trim().isLength({ min: 3 }).escape(),
        body('password', 'password must be 3 characters or more').trim().isLength({ min: 3 }).escape(),
        async (request, response) => {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                var firstError = (errors.array())[0]
                throw new AppError(firstError.msg, 400);
            }

            const { username, name, password } = request.body

            const user = new User({
                username,
                name,
                passwordHash: password, // will be hashed in the pre save hook/middleware
            })

            const savedUser = await user.save()
            console.log(savedUser);

            response.status(201).json(savedUser)
        }
    ]
)

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, url: 1, author: 1 });
    response.json(users)
})

module.exports = usersRouter