const TagDto = require('./tags.dto');
const CategoryDto = require('./categories.dto');

exports.buildHome = (tags, categories) => {
    return {
        tags: tags.map(tag => TagDto.buildDto(tag, true)),
        categories: categories.map(tag => CategoryDto.buildDto(tag, true)),
    };
};