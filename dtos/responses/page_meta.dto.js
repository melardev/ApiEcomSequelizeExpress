module.exports = {

    build(currentItemsCount, currentPage, pageSize, totalResourcesCount, basePath) {

        const data = {};
        data.current_items_count = currentItemsCount;
        data.total_items_count = totalResourcesCount;
        data.offset = (currentPage - 1) * pageSize;
        data.requested_page_size = pageSize;
        data.current_page_number = currentPage;

        data.prev_page_number = 1;
        data.number_of_pages = Math.ceil(data.total_items_count / data.requested_page_size);

        if (data.current_page_number < data.number_of_pages) {
            data.has_next_page = true;
            data.next_page_number = data.current_page_number + 1;
        } else {
            data.has_next_page = false;
            data.next_page_number = 1;
        }
        if (data.current_page_number > 1)
            data.prev_page_number = data.current_page_number - 1;
        else {
            data.has_prev_page = false;
            data.prev_page_number = 1
        }

        data.next_page_url = `${basePath}?page=${data.next_page_number}&page_size=${data.requested_page_size}`;
        data.prev_page_url = `${basePath}?page=${data.prev_page_number}&page_size=${data.requested_page_size}`;
        return data;

    }
};
