export class response {
  constructor(status, message, data) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
export class createUserResponse {
  constructor(status, message, user, userRole) {
    this.status = status;
    this.message = message;
    this.user = user;
    this.userRole = userRole;
  }
}
export class errorResponse {
  constructor(status, message) {
    this.status = status;
    this.message = message;
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
