
import { StatusCodes } from 'http-status-codes';


export class SuccessResponse {
    public readonly message: string;
    public readonly data: any;
    public readonly statusCode: StatusCodes;

    constructor(data: any = null, message: string = "", statusCode: StatusCodes = StatusCodes.OK) {
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
    }
}
