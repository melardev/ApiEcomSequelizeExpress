const RolesDto = require("./roles.dto");



function registerDto(user) {
    return {
        success: true,
        full_messages: ['User registered successfully']
    };
}

function loginSuccess(user) {
    const token = user.generateJwt();
    return {
        success: true,
        token,
        user: {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: RolesDto.toNameList(user.roles || []),
            token
        }
    }
}

function buildOnlyForIdAndUsername(user) {
    if (user == null)
        return {};
    return {
        id: user.id,
        username: user.username
    }
}

module.exports = {
    registerDto, loginSuccess, buildOnlyForIdAndUsername
};