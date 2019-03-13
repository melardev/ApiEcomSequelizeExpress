const UserDto = require('./users.dto');
const ProductResponseDto = require('./products.dto');
const AddressDto = require('./address.dto');
const PageMetaDto = require('./page_meta.dto');


function buildPagedList(orders, page, pageSize, totalOrdersCount, basePath, includeUser = false, includeAddress = false, includeProduct = false) {
    return {
        success: true,
        page_meta: PageMetaDto.build(orders.length, page, pageSize, totalOrdersCount, basePath),
        ...buildDtos(orders, includeUser, includeAddress, includeProduct),
    }
}

function buildDtos(orders, includeUser = false, includeAddress = false, includeProduct = false) {
    return {
        orders: orders.map(order => buildDto(order, includeUser, includeAddress, includeProduct))
    };
}

function buildDto(order, includeUser = false, includeAddress = false, includeOrderItem = false, includeAddressUser = false) {
    const data = {
        id: order.id,
        tracking_number: order.trackingNumber,
        order_status: order.orderStatusStr,
        order_items_count: order.order_items_count
    };

    if (includeOrderItem) {
        data.order_items_count = undefined;
        data.order_items = order.order_items.map(orderItem => {
            return {
                ...ProductResponseDto.buildIdSlugNameAndPrice(orderItem),
                quantity: orderItem.quantity
            };
        });
    }
    if (includeUser)
        data.user = UserDto.buildOnlyForIdAndUsername(order.user);

    if (includeAddress)
        data.address = AddressDto.buildDto(order.address, includeAddressUser);

    return data;
}

function buildDetails(order) {
    return {
        success: true,
        ...buildDto(order),
        created_at: order.createdAt,
        updated_at: order.updatedAt
    }
}


module.exports = {
    buildDtos, buildDto, buildDetails, buildPagedList
};
