const PageMetaDto = require('./page_meta.dto');

function buildPagedList(tags, page, pageSize, totalItemCount, basePath) {
    return {
        success: true,
        page_meta: PageMetaDto.build(tags.length, page, pageSize, totalItemCount, basePath),
        ...buildDtos(tags),
    }
}

function buildDtos(tags) {
    if (!tags)
        return {tags: []};
    return {
        tags: tags.map(tag => buildDto(tag, true))
    }
}

function buildDto(tag, includeUrls = false) {
    const summary = {
        id: tag.id,
        name: tag.name,
    };

    if (includeUrls && tag.images) {
        summary.image_urls = tag.images.map(image => image.filePath);
    }
    return summary;
}

module.exports = {
    buildDtos, buildPagedList, buildDto
};
