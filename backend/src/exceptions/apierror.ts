import { StatusCodes } from 'http-status-codes';

export default class ApiError {
    statusCode: StatusCodes;
    error: string
    constructor(errorMessage: string, statusCode: StatusCodes) {
        this.error = errorMessage;
        this.statusCode = statusCode;
    }
}