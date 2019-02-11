exports.createProductResponseDto = (req) => {
    const bindingResult = {
        validatedData : {},
        errors: {}
    };

    if (req.body.name) {
        bindingResult.validatedData.name = req.body.name;
    } else {
        bindingResult.errors.name = 'You must provide a valid name';
    }

    if (req.body.description) {
        bindingResult.validatedData.description = req.body.description;
    } else {
        bindingResult.errors.description = 'You must provide a valid description';
    }
    if (req.body.price) {
        bindingResult.validatedData.price = req.body.price;
    } else {
        bindingResult.errors.price = 'You must provide a valid price';
    }
    if (req.body.stock) {
        bindingResult.validatedData.stock = req.body.stock;
    } else {
        bindingResult.errors.stock = 'You must provide a stock value for this product';
    }
    return bindingResult;
};
