const Product = require('../../../models').Product;

// CREATE PRODUCT
exports.createProduct = (req, res) => {
    // Check if this is admin
    if (!req.user || req.user.is_admin === false) {
        return res.status(403).send({error: 'Not authorized.'});
    }

    const name = req.body.name ? req.body.name.trim() : '';
    const description = req.body.description ? req.body.description.trim() : '';
    const price = parseFloat((Math.round(req.body.price * 100) / 100).toFixed(2));

    // Check all inputs
    if (!name || !description || typeof price !== 'number') {
        return res
            .status(400)
            .send({error: 'All inputs are required.'});
    }

    const productObject = {
        name,
        price,
        description,
    };

    // Check if the product is already in database (same name)
    Product
        .findAll({where: {name}})
        .then((products) => {
            if (products.length > 0) {
                return res.status(400).send({error: 'Product already exists.'});
            }
            // Create a product
            Product.create(productObject)
                .then(data => res.json(data))
                .catch((err) => {
                    console.error('Error on post: ', err);
                    return res.status(400).send({error: err.message});
                });
        })
        .catch((error) => {
            return res.status(400).send({error: error.message});
        });
};

// UPDATE PRODUCT
exports.updateProduct = (req, res) => {
    // Check if this is admin
    if (!req.user || req.user.is_admin === false) {
        return res.status(403).send({error: 'Not authorized.'});
    }

    const price = parseFloat((Math.round(req.body.price * 100) / 100).toFixed(2));

    if (typeof price !== 'number') {
        return res
            .status(400)
            .send({error: 'price must be number.'});
    }

    Product.findById(req.params.productId)
        .then((product) => {
            const projectData = {
                name: req.body.name || product.name,
                price: price < 0 ? product.price : price,
                description: req.body.description || product.description,
            };

            product.update(projectData)
                .then(data => res.json(data))
                .catch((error) => {
                    console.error('Error on update: ', error);
                    return res.status(400).send({error: err.message});
                });
        })
        .catch((err) => {
            console.error('Error on finding a product: ', err);
            return res.status(400).send({error: err.message});
        });
};

// DELETE PRODUCT
exports.deleteProduct = (req, res) => {
    // Check if this is admin
    if (!req.user || req.user.is_admin === false) {
        return res.status(403).send({error: 'Not authorized.'});
    }

    Product.findById(req.params.productId)
        .then((product) => {
            product.destroy()
                .then(data => res.json(data))
                .catch((error) => {
                    console.error('Error on delete: ', error);
                    return res.status(400).send({error: err.message});
                });
        })
        .catch((err) => {
            console.error('Error on finding a product: ', err);
            return res.status(400).send({error: err.message});
        });
};
