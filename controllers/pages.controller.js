const PagesDto = require('../dtos/responses/pages.dto');
const Tag = require('./../config/sequelize.config').Tag;
const Category = require('./../config/sequelize.config').Category;
const CategoryImage = require('./../config/sequelize.config').CategoryImage;
const TagImage = require('./../config/sequelize.config').TagImage;
const AppResponseDto = require('../dtos/responses/app_response.dto');

exports.index = (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    const offset = (page - 1) * pageSize;

    return Promise.all([
        Tag.findAll({
            offset,
            limit: pageSize,
            order: [['createdAt', 'DESC'],],
            include: [
                {
                    model: TagImage,
                    required: false,
                    as: 'images',
                    attributes: ['id', 'filePath']
                },
            ]
        }),
        Category.findAll({
            offset,
            limit: pageSize,
            order: [['createdAt', 'DESC'],],
            include: [
                {
                    model: CategoryImage,
                    attributes: ['id', 'filePath'],
                    as: 'images',
                    required: false,
                },
            ]
        }),
    ]).then(function (results) {
        const tags = results[0];
        const categories = results[1];

        return res.json(AppResponseDto.buildSuccessWithDto(PagesDto.buildHome(tags, categories)));
    }).catch(err => {
        return res.json(AppResponseDto.buildWithErrorMessages(err));
    });
};
