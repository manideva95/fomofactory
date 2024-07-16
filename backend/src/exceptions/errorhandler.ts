import { Response } from "express"
import ApiError from "./apierror"

export function errorhandler(error: ApiError, res: Response) {
    if (error instanceof ApiError) {
        res.status(error.statusCode).send(error)
    } else {
        res.status(417).send(new ApiError("An unknown issue occurred. Please try again later or contact support.", 417));
    }
}