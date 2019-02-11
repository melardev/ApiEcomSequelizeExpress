const sanitizeHtml = require('sanitize-html');
exports.sanitizeInput = (dirty, options) => {
    const htmlSanitizeOptions = {
        allowedTags: [], allowedAttributes: []
    };

    return sanitizeHtml(dirty, options || htmlSanitizeOptions);
};