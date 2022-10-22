import { Router, Request, Response, NextFunction } from "express";
import { deleteFileOnError, formidableParse } from "../middlewares/formidable";
import { checkIfAdmin } from "../middlewares/checkRole";
import { checkJwt } from "../middlewares/checkJwt";
import { authorCoverDir } from "../config/pathFiles";
import { AuthorController } from "../controllers/author.controller";
import normalizeQuery from "../middlewares/queryNormalize";

const authorRoutes: Router = Router();
const frommidableParse = formidableParse({
    allowEmptyFiles: false,
    keepExtensions: true,
    multiples: true,
    maxFileSize: 20 * 1024 * 1024, //20MB 
    uploadDir: authorCoverDir,
    filter: function ({ name, originalFilename, mimetype }) {
        return (mimetype) ? mimetype.includes('image') : false;
    }
})

authorRoutes
    .get('/', AuthorController.getAll)

    .get('/:id', AuthorController.getInfo(false))

    .get('/withHiddendInfo/:id', [checkJwt, checkIfAdmin], AuthorController.getInfo(true))

    .get('/bookByAuthor/:id', normalizeQuery(['createdAt', 'title']), AuthorController.getBookByAuthor(false))

    .get('/allBookByAuthor/:id', [checkJwt, checkIfAdmin, normalizeQuery(['createdAt', 'title'])], AuthorController.getBookByAuthor(true))

    .post('/', frommidableParse, [checkJwt, checkIfAdmin], AuthorController.save)

    // .put('/:id', frommidableParse, [checkJwt, checkIfAdmin], AuthorController.update)

    .delete('/:id', [checkJwt, checkIfAdmin], AuthorController.delete)

    .use((err: Error, req: Request, res: Response, next: NextFunction) => {
        if ('files' in req)
            next(err)
    }, deleteFileOnError)

export default authorRoutes;