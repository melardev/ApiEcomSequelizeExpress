const sanitizeInput = require('../../utils/sanitize').sanitizeInput;
exports.createUserRequestDto = (body) => {
    const resultBinding = {
        validatedData: {},
        errors: {},
    };

    // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!body.first_name || body.first_name.trim() === '')
        resultBinding.errors.firstName = 'firstName is required';
    else
        resultBinding.validatedData.firstName = sanitizeInput(body.first_name);

    if (!body.last_name || body.last_name.trim() === '')
        resultBinding.errors.lastName = 'LastName is required';
    else
        resultBinding.validatedData.lastName = sanitizeInput(body.last_name);

    if (!body.username || body.username.trim() === '')
        resultBinding.errors.username = 'Username is required';
    else
        resultBinding.validatedData.username = sanitizeInput(body.username);

    if (body.email && body.email.trim() !== '' && emailRegex.test(String(body.email).toLowerCase()))
        resultBinding.validatedData.email = sanitizeInput(body.email.toLowerCase());
    else
        resultBinding.errors.email = 'Email is required';
    ;

    if (body.password && body.password.trim() !== '')
        resultBinding.validatedData.password = body.password;
    else
        resultBinding.errors.password = 'Password must not be empty';

    if (body.password_confirmation && body.password_confirmation.trim() !== '' && body.password_confirmation === body.password)
        resultBinding.validatedData.password_confirmation = body.password_confirmation;
    else
        resultBinding.errors.password_confirmation = 'Confirmation password must not be empty and matching password';

    return resultBinding;
};
