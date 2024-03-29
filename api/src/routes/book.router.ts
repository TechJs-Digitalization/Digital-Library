import { Router, Request, Response, NextFunction } from "express";
import BookController from "../controllers/book.controller";
import { deleteFileOnError, formidableParse } from "../middlewares/formidable";
import * as bookVerification from "../middlewares/bookVerification";
import { checkIfAdmin } from "../middlewares/checkRole";
import { checkJwt } from "../middlewares/checkJwt";
import { bookCoverDir } from "../config/pathFiles";

const bookRouter: Router = Router();
const frommidableParse = formidableParse({
    allowEmptyFiles: false,
    keepExtensions: true,
    multiples: true,
    maxFileSize: 20 * 1024 * 1024, //20MB 
    uploadDir: bookCoverDir,
    filter: function ({ name, originalFilename, mimetype }) {
        return (mimetype) ? mimetype.includes('image') : false;
    }
})

bookRouter
    .get('/:id', BookController.getById)

    .post('/', frommidableParse, [checkJwt, checkIfAdmin, bookVerification.verify], BookController.save)

    .put('/:id', frommidableParse, [checkJwt, checkIfAdmin, bookVerification.beforeUpdateOperation], BookController.update)

    .delete('/:id', [checkJwt, checkIfAdmin, bookVerification.beforeDeleteOperation], BookController.delete)

    .use((err: Error, req: Request, res: Response, next: NextFunction) => {
        if ('files' in req)
            next(err)
    }, deleteFileOnError)

export default bookRouter;