const Comment = require('../../config/sequelize.config').Comment;
const Product = require('../../config/sequelize.config').Product;
const User = require('../../config/sequelize.config').User;

const AppResponseDto = require('../../dtos/responses/app_response.dto');

function init(router) {
    router.param('comment', function (req, res, next, id) {
        Comment.findOne({
            where: {id: id},
            include: [{
                model: User,
                attributes: ['id', 'username']
            }, {
                model: Product,
                attributes: ['id', 'name', 'slug']
            },]
        }).then(function (comment) {
            if (!comment)
                return res.json(AppResponseDto.buildWithErrorMessages('Comment not found'), 404);

            req.comment = comment;
            return next();
        }).catch(err => {
            return res.json(AppResponseDto.buildWithErrorMessages('Error ' + err));
        });
    });


    router.param('comment_load_ids', function (req, res, next, id) {
        Comment.findOne({
            where: {id},
            attributes: ['productId', 'userId', 'id'],
        }).then(function (comment) {
            if (!comment) {
                return res.json(AppResponseDto.buildWithErrorMessages('Comment not found'), 404);
            }
            req.comment = comment;
            req.userOwnable = comment;
            next();
        }).catch(err => {
            return res.json(AppResponseDto.buildWithErrorMessages(err.message));
        });
    });
};

module.exports = {
    init
};