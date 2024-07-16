import { Request, Response, Router } from "express";
import { CryptoManagement } from "../business";
import { SuccessResponse } from "../../exceptions/successHandler";
import { StatusCodes } from "http-status-codes";
import { errorhandler } from "../../exceptions/errorhandler";

export var router: Router = Router();

router.get('/cryptos', async (req: Request, res: Response) => {
    try {
        let cryptos = await new CryptoManagement().cryptos()
        res.send(new SuccessResponse(cryptos, "Cryptos retrived successfully", StatusCodes.OK));
    } catch (error) {
        errorhandler(error, res);
    }
});