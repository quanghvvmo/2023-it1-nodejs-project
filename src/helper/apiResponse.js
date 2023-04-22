class APIResponse {
    constructor(data, status, message) {
        this.data = data;
        this.status = status;
        this.message = message;
    }
}

class APIPagingResponse {
    constructor(data, pageIndex, pageSize, totalCount, totalPages) {
        this.data = data;
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.totalCount = totalCount;
        this.totalPages = totalPages;
    }
}

module.exports = {
    APIResponse,
    APIPagingResponse
}