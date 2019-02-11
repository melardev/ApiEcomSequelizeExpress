const Tag = require('../../config/sequelize.config').Tag;
const AppResponseDto = require('./../../dtos/responses/app_response.dto');

function init(router) {
    router.param('tag_slug', function (req, res, next, slug) {
        Tag.findOne({
            attributes: ['id'],
            where: {slug: slug},
        }).then(tag => {
            req.tagId = tag.id;
            return next();
        }).catch(err => {
            return res.json(AppResponseDto.buildWithErrorMessages(err.message));
        });
    });

    router.param('tagId', function (req, res, next, id) {
        req.tagId = id;
        next();
    });

}

module.exports = {
    init
};