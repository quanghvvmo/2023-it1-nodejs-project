export class response {
  constructor(status, message, data) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
export class paginatedResponse {
  constructor(pageIndex, pageSize, totalCount, totalPages, data) {
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.totalCount = totalCount;
    this.totalPages = totalPages;
    this.data = data;
  }
}
