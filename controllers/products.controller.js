const _ = require('lodash');

const sequelize = require('./../config/sequelize.config').sequelize;
const Product = require('./../config/sequelize.config').Product;
const ProductTag = require('./../config/sequelize.config').ProductTag;
const Tag = require('./../config/sequelize.config').Tag;
const ProductImage = require('./../config/sequelize.config').ProductImage;
const Category = require('./../config/sequelize.config').Category;
const Comment = require('./../config/sequelize.config').Comment;
const User = require('./../config/sequelize.config').User;

const AppResponseDto = require('./../dtos/responses/app_response.dto');
const ProductRequestDto = require('./../dtos/requests/products.dto');
const ProductResponseDto = require('./../dtos/responses/products.dto');


exports.getAll = (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    Promise.all([
        Product.findAll({
            offset: 0,
            limit: 5,
            order: [
                ['createdAt', 'DESC'],
                // ['price', 'DESC']
            ],
            // [Comment, 'createdAt', 'DESC'],

            attributes: ['id', 'name', 'slug', 'price', 'created_at', 'updated_at'
                // ['publish_on', 'created_at'],
                // [sequelize.fn('count', sequelize.col('comments.id')), 'commentsCount']
                // [sequelize.fn('COUNT', sequelize.col('id')), 'productsCount'] // instance.get('productsCount')
            ], // retrieve publish_on column and report it as created_at javascript attribute
            // or
            // attributes: { include: [[sequelize.fn('COUNT', sequelize.col('hats')), 'no_hats']] }

            // attributes: {exclude: ['description']},
            include: [
                /*{
                    model: Comment,
                    attributes: []
                }
                ,*/ {
                    model: Tag,
                    exclude: ['description', 'created_at', 'updated_at']
                }, {
                    model: Category,
                    attributes: ['id', 'name'],
                }
            ],
            // group: ['products.id'],
            offset: (page - 1) * pageSize,
            limit: pageSize,
        }),
        Product.findAndCountAll({attributes: ['id']})
    ])
        .then(results => {
            const products = results[0];
            const productsCount = results[1].count;
            Comment.findAll({
                where: {
                    productId: {
                        [sequelize.Op.in]: products.map(product => product.id)
                    }
                },
                attributes: ['productId', [sequelize.fn('COUNT', sequelize.col('id')), 'commentsCount']],
                group: 'productId',
            }).then(results => {
                products.forEach(product => {
                    let comment = results.find(comment => product.id === comment.productId);
                    if (comment != null)
                        product.comments_count = comment.get('commentsCount');
                    else
                        product.comments_count = 0;
                });
                return res.json(ProductResponseDto.buildPagedList(products, page, pageSize, productsCount, req.baseUrl));
            }).catch(err => {
                res.json(AppResponseDto.buildWithErrorMessages(err.message));
            });

        }).catch(err => {
        return res.status(400).send(err.message);
    });
};

exports.getByIdOrSlug = function (req, res, next) {

    const query = _.assign(req.query, {
        include: [
            {
                model: Tag,
                attributes: ['id', 'name']
            },
            {
                model: Category,
                attributes: ['id', 'name']
            },
            {
                model: Comment,
                attributes: ['id', 'content'],
                include: [{model: User, attributes: ['id', 'username']}]
            }]
    });

    Product.findOne(req.query).then(product => {
        return res.json(ProductResponseDto.buildDetails(product, true, false));
    }).catch(err => {
        return res.json(AppResponseDto.buildWithErrorMessages(err.message));
    });
};

exports.searchProduct = (req, res, next) => {
    const products = Product.findAll({
        where: {
            slug: {[Op.like]: '%' + req.slug + '%'}
        }
    });
};

exports.getByTag = function (req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    ProductTag.findAll({
        where: {tagId: req.tagId},
        attributes: ['productId'],
        order: [
            ['createdAt', 'DESC'],
        ],

    }).then(pts => {
        let productIds = pts.map(pt => pt.productId);
        const productsCount = pts.length;
        productIds = _.slice(productIds, offset, offset + limit);
        Promise.all([
            Product.findAll({
                attributes: ['id', 'name', 'slug', 'created_at', 'updated_at'],
                where: {
                    id: {
                        [sequelize.Op.in]: productIds,
                    }
                },
                include: [Tag, Category]
            }),
            Comment.findAll({
                where: {
                    productId: {
                        [sequelize.Op.in]: productIds,
                    }
                },
                attributes: ['id', 'productId', [sequelize.fn('count', sequelize.col('id')), 'commentsCount']],
                // instance.get('productsCount')
                group: 'productId'
            })
        ]).then(results => {
            const products = results[0];
            const comments = results[1];

            products.forEach(product => {
                let comment = comments.find(comment => product.id === comment.productId);
                if (comment != null)
                    product.comments_count = comment.get('commentsCount');
                else
                    product.comments_count = 0;
            });

            return res.json(ProductResponseDto.buildPagedList(products, page, pageSize, productsCount, req.baseUrl));
        }).catch(err => {
            return res.json(AppResponseDto.buildWithErrorMessages(err.message));
        });
    }).catch(err => {
        return res.json(AppResponseDto.buildWithErrorMessages(err.message));
    });
};

exports.getByCategory = function (req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    const offset = (page - 1) * pageSize;

    const categoryQuery = {};
    if (!!req.params.category_slug)
        categoryQuery.slug = req.params.category_slug;
    else
        categoryQuery.id = req.params.categoryId;

    Product.findAndCountAll({
        attributes: ['id', 'name', 'slug', 'created_at', 'updated_at'],
        include: [
            {
                model: Category,
                where: categoryQuery,
                // through: {attributes: ['id'],}
            },
            {
                model: Tag,
                exclude: ['description', 'created_at', 'updated_at']
            },
            {
                model: Comment,
                attributes: ['id', 'productId'],
                group: 'productId',
            }],

        order: [
            ['createdAt', 'DESC'],
            // ['price', 'DESC']
        ],

        offset,
        limit: pageSize
    }).then(products => {
        return res.json(ProductResponseDto.buildPagedList(products.rows, page, pageSize, products.count, req.baseUrl));
    }).catch(err => {
        return res.json(AppResponseDto.buildWithErrorMessages(err.message));
    });
};

exports.createProduct = (req, res) => {
    const bindingResult = ProductRequestDto.createProductResponseDto(req);
    const promises = [];
    if (!_.isEmpty(bindingResult.errors)) {
        return res.json(AppResponseDto.buildWithErrorMessages(bindingResult.errors));
    }
    let transac = undefined;
    sequelize.transaction({autocommit: false}).then(async function (transaction) {
        transac = transaction;
        const tags = req.body.tags || [];
        const categories = req.body.categories || [];
        _.forOwn(tags, (description, name) => {
            promises.push(Tag.findOrCreate({
                where: {name},
                defaults: {description}
            }));
        });
        // another way of doing it without lodash
        Object.keys(categories).forEach(name => {
            promises.push(Category.findOrCreate({
                where: {name},
                defaults: {description: categories[name]}
            }));
        });
        promises.push(Product.create(bindingResult.validatedData, {transaction}));
        await Promise.all(promises).then(async results => {
            promises.length = 0;
            const product = results.pop();
            const tags = [];
            const categories = [];
            results.forEach(result => {
                if (result[0].constructor.getTableName() === 'tags') // method 1 of getting table name
                    tags.push(result[0]);
                else if (result[0]._modelOptions.name.plural === 'categories') // method 2 of getting table name
                    categories.push(result[0]);
            });

            promises.push(product.setTags(tags, {transaction}));
            promises.push(product.setCategories(categories, {transaction}));

            for (let i = 0; req.files != null && i < req.files.length; i++) {
                let file = req.files[i];
                let filePath = file.path.replace(new RegExp('\\\\', 'g'), '/');
                filePath = filePath.replace('public', '');
                promises.push(ProductImage.create({
                    fileName: file.filename,
                    filePath: filePath,
                    originalName: file.originalname,
                    fileSize: file.size,
                    productId: product.id
                }, {transaction: transaction}));
            }

            await Promise.all(promises).then(results => {
                const images = _.takeRightWhile(results, result => {
                    return result.constructor.getTableName && result.constructor.getTableName() === 'file_uploads'
                });
                product.images = images;
                product.tags = tags;
                product.categories = categories;
                transaction.commit();
                return res.json(AppResponseDto.buildWithDtoAndMessages(ProductResponseDto.buildDto(product), 'product created successfully'));
            }).catch(err => {
                throw err;
            });
        }).catch(err => {
            throw err;
        });
    }).catch(err => {
        transac.rollback();
        return res.json(AppResponseDto.buildWithErrorMessages(err));
    });
};

exports.updateProduct = (req, res, next) => {
    res.json(AppResponseDto.buildWithErrorMessages('not implemented yet'));
};

exports.deleteProduct = (req, res, next) => {
    req.product.destroy(req.query).then(result => {
        res.json(AppResponseDto.buildSuccessWithMessages('Product deleted successfully'));
    }).catch(err => {
        res.json(AppResponseDto.buildWithErrorMessages(err));
    });
};
