class AppError extends Error {
    constructor(message, statusCode, errors = null) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        this.errors = errors;
    }
}

export class BadRequestError extends AppError {
    constructor(message = "Bad Request") {
        super(message, 400);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized access") {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Forbidden action") {
        super(message, 403);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

export class ConflictError extends AppError {
    constructor(message = "Conflict action") {
        super(message, 404);
    }
}

export class UnprocessableEntityError extends AppError {
    constructor({message = "Unprosessable Entity Error", errors}) {
        super(message, 422, errors);
    }
}

export class InternalServerError extends AppError {
    constructor(message = "Internal Server Error") {
        super(message, 500);
    }
}
