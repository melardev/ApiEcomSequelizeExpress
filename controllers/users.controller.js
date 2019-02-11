const _ = require('lodash');

const User = require('../config/sequelize.config').User;
const Role = require('../config/sequelize.config').Role;
const Op = require('../config/sequelize.config').Sequelize.Op;
const UserResponseDto = require('../dtos/responses/users.dto');
const UserRequestDto = require('../dtos/requests/users.dto');

const AppResponseDto = require('../dtos/responses/app_response.dto');


exports.register = (req, res) => {
    const body = req.body;
    const resultBinding = UserRequestDto.createUserRequestDto(req.body);
    if (!_.isEmpty(resultBinding.errors)) {
        return res.status(422).json(AppResponseDto.buildWithErrorMessages(resultBinding.errors));
    }

    const email = resultBinding.validatedData.email;
    const username = resultBinding.validatedData.username;

    User.findOne({
        where: {
            [Op.or]: [{username}, {email}]
        }
    })
        .then((user) => {

            if (user) {
                const errors = {};
                // If the user exists, return Error
                if (user.username === body.username)
                    errors.username = 'username: ' + body.username + ' is already taken';

                if (user.email === body.email)
                    errors.email = 'Email: ' + body.email + ' is already taken';

                if (!_.isEmpty(errors)) {
                    return res.status(403).json(AppResponseDto.buildWithErrorMessages(errors));
                }
            }

            User.create(resultBinding.validatedData)
                .then((user) => {
                    if (user === null) {
                        throw user
                    }

                    if (user) {
                        console.dir(user);
                        console.log(user.toJSON());
                        res.json(UserResponseDto.registerDto(user));
                    } else
                        console.log('user is empty ...???');
                })
                .catch((err) => {
                    return res.status(400).send(AppResponseDto.buildWithErrorMessages(err));
                });
        })
        .catch((err) => {
            return res.status(400).send(AppResponseDto.buildWithErrorMessages(err));
        });
};

exports.login = (req, res) => {
    // TODO: move this to UserRequestDto
    const username = req.body.username;
    const password = req.body.password;

    // if no email or password then send
    if (!username || !password) {
        res.status(400).send({error: 'You need a email and password'});
        return;
    }

    // check 1: lookup the user if it already exists
    // check2: compare passwords
    User.findOne({
        where: {username},
        include: [
            {
                model: Role,
                attributes: ['name']
            }
        ]
    }).then(function (user) {
        if (user && user.isValidPassword(password)) {
            req.user = user;
            return res.status(200).json(UserResponseDto.loginSuccess(user));
        } else
            return res.json(AppResponseDto.buildWithErrorMessages('Invalid credentials'));
    }).catch(err => {
        res.json(AppResponseDto.buildWithErrorMessages(err));
    });
};
