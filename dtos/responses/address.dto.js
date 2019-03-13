const UserDto = require('./users.dto');
const PageMetaDto = require('./page_meta.dto');


function buildPagedList(addresses, page, pageSize, totalProductsCount, basePath) {
    return {
        success: true,
        page_meta: PageMetaDto.build(addresses.length, page, pageSize, totalProductsCount, basePath),
        ...buildDtos(addresses),
    }
}

function buildDtos(addresses) {
    return {
        addresses: addresses.map(address => buildDto(address))
    }
}

function buildDto(address, includeUser = false) {
    if (address == null)
        return {};
    const summary = {
        id: address.id,
        first_name: address.firstName,
        last_name: address.lastName,
        address: address.address,
        city: address.city,
        country: address.country,
        zip_code: address.zipCode,
    };

    if (includeUser)
        summary.user = UserDto.buildOnlyForIdAndUsername(address.user);

    return summary;
}

module.exports = {
    buildDtos, buildDto, buildPagedList
};
